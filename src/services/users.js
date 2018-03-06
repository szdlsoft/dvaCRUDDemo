import request from '../utils/request';
import { PAGE_SIZE } from '../constants';

const urlroot = '/api/users';

export function fetch({ page = 1}){
    return request(`${urlroot}?page=${page}&pageSize=${PAGE_SIZE}`,{
        method: 'GET',
    });
}

export function remove(id){
    return request(`${urlroot}/${id}`,{
        method: 'DELETE',
    });
}
//Update 
export function patch(id, values){
    return request(`${urlroot}/${id}`,{
        method: 'PATCH',
        body: JSON.stringify(values),
    });
}

//Create
export function create(values){
    console.log(JSON.stringify(values));
    return request(`${urlroot}`,{
        method: 'POST',
        body: JSON.stringify(values),
    });
}