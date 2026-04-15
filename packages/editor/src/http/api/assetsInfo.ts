import {request} from "@/http/request";

/**
 * 获取资产列表
 */
export function fetchGetAssetsList(params:Service.ListPageQueryParams){
    return request.get<Service.ListPageResult<IAssets.Item>>(`/assets/assetsInfo/getAll`,{params});
}

/**
 * 新增资产
 */
export function fetchAddAsset(data:IAssets.Item){
    return request.post<IAssets.Item>(`/assets/assetsInfo`,data);
}

/**
 * 更新资产
 */
export function fetchUpdateAsset(data:IAssets.Item){
    return request.put<IAssets.Item>(`/assets/assetsInfo`,data);
}

/**
 * 移除资产
 */
export function fetchRemoveAsset(id:IAssets.Item['id']){
    return request.delete(`/assets/assetsInfo/${id}`,{});
}


/**
 * 获取分类下的资产tags
 */
export function fetchGetAssetCategoryTags(type:IAssets.SupportType, category: string){
    return request.get<string[]>(`/assets/assetsInfo/selectTags`, {
        params:{
            type,
            category
        }
    });
}