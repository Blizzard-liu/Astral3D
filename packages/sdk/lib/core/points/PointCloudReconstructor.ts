/**
 * @author ErSan
 * @email  mlt131220@163.com
 * @date   2025/07/03 19:38
 * @description 点云语义重建
 */
import * as THREE from 'three';
import {ConvexGeometry} from "three/addons/geometries/ConvexGeometry.js";

class PointCloudReconstructor {
    // 点云数据存储
    points: THREE.Vector3[] = [];
    colors: THREE.Color[] = [];
    // 语义颜色分组
    colorGroups:Map<string,THREE.Vector3[]> = new Map();

    colorTolerance: number;
    distanceThreshold: number;
    minClusterSize: number;
    downsampleResolution: number;

    progressCallback: Function | null;

    constructor() {
        // RGB颜色容差
        this.colorTolerance = 5;
        // 空间聚类距离阈值
        this.distanceThreshold = 0.3;
        // 最小聚类点数
        this.minClusterSize = 10;
        // 点云抽稀系数
        this.downsampleResolution = 0.05;

        // 进度回调
        this.progressCallback = null;
    }

    /**
     * 处理几何数据，提取点和颜色
     * @param {THREE.BufferGeometry} geometry - 点云几何数据
     */
    processGeometry(geometry) {
        this.points = [];
        this.colors = [];

        const vertices = geometry.getAttribute('position').array;
        const colors = geometry.getAttribute('color')?.array || [];
        const hasColors = colors.length > 0;

        for (let i = 0; i < vertices.length; i += 3) {
            this.points.push(new THREE.Vector3(
                vertices[i],
                vertices[i + 1],
                vertices[i + 2]
            ));

            if (hasColors) {
                this.colors.push(new THREE.Color(
                    colors[i],
                    colors[i + 1],
                    colors[i + 2]
                ));
            } else {
                this.colors.push(new THREE.Color(0xffffff));
            }
        }
    }

    // 点云抽稀算法
    downsamplePoints(points, resolution) {
        const grid = new Map();
        const downsampled:THREE.Vector3[] = [];

        points.forEach(point => {
            const gridX = Math.floor(point.x / resolution);
            const gridY = Math.floor(point.y / resolution);
            const gridZ = Math.floor(point.z / resolution);
            const gridKey = `${gridX},${gridY},${gridZ}`;

            if (!grid.has(gridKey)) {
                grid.set(gridKey, true);
                downsampled.push(point.clone());
            }
        });

        return downsampled;
    }

    /**
     * 按语义颜色分组点云
     */
    groupBySemanticColor() {
        this.colorGroups.clear();

        for (let i = 0; i < this.points.length; i++) {
            const color = this.colors[i];
            const colorKey = this.getColorKey(color);

            if (!this.colorGroups.has(colorKey)) {
                this.colorGroups.set(colorKey, []);
            }

            (this.colorGroups.get(colorKey) as THREE.Vector3[]).push(this.points[i].clone());

            // 更新进度（分组阶段占20%）
            if (this.progressCallback && i % 100 === 0) {
                this.progressCallback(20 * i / this.points.length, `分组点云: ${i}/${this.points.length}`);
            }
        }
    }

    /**
     * 生成颜色分类键值（考虑容差）
     * @param {THREE.Color} color - 输入颜色
     * @returns {string} 颜色分类键
     */
    getColorKey(color) {
        const r = Math.round(color.r * 255 / this.colorTolerance) * this.colorTolerance;
        const g = Math.round(color.g * 255 / this.colorTolerance) * this.colorTolerance;
        const b = Math.round(color.b * 255 / this.colorTolerance) * this.colorTolerance;
        return `${r},${g},${b}`;
    }

    /**
     * 空间聚类算法（使用网格加速）
     * @param {THREE.Vector3[]} points - 输入点集
     * @returns {THREE.Vector3[][]} 聚类结果
     */
    spatialClustering(points:THREE.Vector3[]) {
        const clusters:THREE.Vector3[][] = [];
        const visited = new Set();
        const grid = new Map();
        const gridSize = this.distanceThreshold * 1.5;

        // 创建空间网格
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            const gridKey = this.getGridKey(point, gridSize);

            if (!grid.has(gridKey)) {
                grid.set(gridKey, []);
            }

            grid.get(gridKey).push(i);
        }

        let processed = 0;
        const totalPoints = points.length;

        for (let i = 0; i < points.length; i++) {
            if (visited.has(i)) continue;

            visited.add(i);
            const cluster = [points[i]];
            const queue = [i];

            while (queue.length > 0) {
                const currentIndex = queue.shift() as number;
                const currentPoint = points[currentIndex];

                // 获取当前点所在的网格及其相邻网格
                const neighborCells = this.getNeighborCells(currentPoint, gridSize);

                for (const cell of neighborCells) {
                    if (!grid.has(cell)) continue;

                    const cellPoints = grid.get(cell);
                    for (const neighborIndex of cellPoints) {
                        if (visited.has(neighborIndex)) continue;

                        const neighbor = points[neighborIndex];
                        if (currentPoint.distanceTo(neighbor) < this.distanceThreshold) {
                            visited.add(neighborIndex);
                            cluster.push(neighbor);
                            queue.push(neighborIndex);
                        }
                    }
                }
            }

            if (cluster.length >= this.minClusterSize) {
                clusters.push(cluster);
            }

            // 更新进度（聚类阶段占30%）
            processed++;
            if (this.progressCallback && processed % 10 === 0) {
                const progress = 20 + 30 * processed / totalPoints;
                this.progressCallback(progress, `空间聚类: ${processed}/${totalPoints}`);
            }
        }

        return clusters;
    }

    // 获取网格键值
    getGridKey(point, gridSize) {
        const x = Math.floor(point.x / gridSize);
        const y = Math.floor(point.y / gridSize);
        const z = Math.floor(point.z / gridSize);
        return `${x},${y},${z}`;
    }

    // 获取相邻网格
    getNeighborCells(point, gridSize) {
        const cells:string[] = [];
        const x = Math.floor(point.x / gridSize);
        const y = Math.floor(point.y / gridSize);
        const z = Math.floor(point.z / gridSize);

        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dz = -1; dz <= 1; dz++) {
                    cells.push(`${x + dx},${y + dy},${z + dz}`);
                }
            }
        }

        return cells;
    }

    /**
     * 重建三角面模型（分帧处理）
     * @returns {THREE.Group} 包含所有重建物体的场景组
     */
    reconstruct(onProgress, onComplete) {
        // 更新进度
        let progress = 0;
        onProgress(progress, `分组点云...`);

        // 第一阶段：分组点云
        this.groupBySemanticColor();
        const objectGroup = new THREE.Group();
        const colorKeys = Array.from(this.colorGroups.keys());
        let totalObjects = 0;

        // 创建一个任务队列
        const tasks: {colorKey:string,cluster:THREE.Vector3[]}[] = [];

        progress = 10;
        onProgress(progress, `分组点云完毕`);

        const progressItem = Math.floor(40 / colorKeys.length);

        for (const colorKey of colorKeys) {
            const points = this.colorGroups.get(colorKey);

            // 对点云进行抽稀
            const downsampledPoints = this.downsamplePoints(points, this.downsampleResolution);

            // 空间聚类
            const clusters = this.spatialClustering(downsampledPoints);

            for (const cluster of clusters) {
                tasks.push({
                    colorKey,
                    cluster
                });
            }

            progress += progressItem;
            onProgress(progress, `空间聚类...`);
        }

        let taskIndex = 0;
        const totalTasks = tasks.length;
        let lastUpdateTime = performance.now();

        // 更新进度
        progress = 50;
        onProgress(progress,  `重建对象: ${taskIndex}/${totalTasks}`);

        // 分帧处理函数
        const processNextTask = () => {
            const now = performance.now();
            const elapsed = now - lastUpdateTime;

            // 控制处理速度（每帧最多处理10个任务）
            const maxTasksPerFrame = Math.min(10, Math.max(1, Math.floor(elapsed / 5)));
            let processedThisFrame = 0;

            while (taskIndex < totalTasks && processedThisFrame < maxTasksPerFrame) {
                const task = tasks[taskIndex];
                const { colorKey, cluster } = task;

                try {
                    // 使用凸包算法生成表面
                    const geometry = new ConvexGeometry(cluster);

                    // 从颜色键解析原始颜色
                    const [r, g, b] = colorKey.split(',').map(Number);
                    const material = new THREE.MeshStandardMaterial({
                        color: new THREE.Color(r / 255, g / 255, b / 255),
                        flatShading: true,
                        side: THREE.DoubleSide
                    });

                    const mesh = new THREE.Mesh(geometry, material);
                    objectGroup.add(mesh);
                    totalObjects++;
                } catch (e) {
                    console.warn("凸包生成失败:", e);
                }

                taskIndex++;
                processedThisFrame++;

                // 更新进度（重建阶段占50%）
                const status = `重建对象: ${taskIndex}/${totalTasks}`;
                onProgress(progress + 50 * taskIndex / totalTasks, status);
            }

            // 所有任务完成
            if (taskIndex >= totalTasks) {
                onComplete(objectGroup, totalObjects);
                return;
            }

            // 下一帧继续
            lastUpdateTime = performance.now();
            requestAnimationFrame(processNextTask);
        };

        // 开始重建任务
        processNextTask();
    }

    dispose(){
        this.points = [];
        this.colors = [];
        this.colorGroups = new Map();
        this.progressCallback = null;
    }
}

export {PointCloudReconstructor};
