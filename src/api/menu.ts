// 修改页面反查详情接口
import request from '@/utils/request';

export const getMenusByEmployeeId = (id: string | (string | null)[]) => {
  return request({
    url: `/menus/employee/${id}`,
    method: 'get'
  })
}
