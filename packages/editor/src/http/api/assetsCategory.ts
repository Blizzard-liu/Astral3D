import {request} from "@/http/request";

/**
 * 获取资产分类树
 */
export function fetchAssetsCategoryTreeList(params = {type: ''}){
    return request.get<IAssets.Category[]>(`/assets/assetsCategory/treeList`,{params});
}