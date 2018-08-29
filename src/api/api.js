import axios from 'axios';

axios.defaults.withCredentials = true;

let base = 'http://39.105.27.225';
//let base = 'localhost:8082';

// const service = axios.create({
//     baseURL: base,
//     timeout: 5000,
//     withCredentials: true,
// })
//
// // 发送请求前处理request的数据
// axios.defaults.transformRequest = [function (data) {
//     let newData = ''
//     for (let k in data) {
//         newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
//     }
//     return newData
// }]
//
// // request拦截器
// service.interceptors.request.use(
//     config => {
//         // 发送请求之前，要做的业务
//         return config
//     },
//     error => {
//         // 错误处理代码
//
//         return Promise.reject(error)
//     }
// )
//
// // response拦截器
// service.interceptors.response.use(
//     response => {
//         // 数据响应之后，要做的业务
//         return response
//     },
//     error => {
//         return Promise.reject(error)
//     }
// )
/**
 * UserApi
 * @param params
 * @returns {Promise.<TResult>}
 */

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

//export const getUserList = params => { return axios.get(`${base}/web/manage/course/list`, { params: params }); };

export const getCourseListPage = params => { return axios.get(`${base}/web/manage/course/list`, { params: params }); };

export const removeCourse = params => { return axios.delete(`${base}/web/manage/course/delete`, { params: params }); };

export const batchRemoveCourse = params => { return axios.delete(`${base}/web/manage/course/delete`, { params: params }); };

export const editCourse = params => { return axios.put(`${base}/web/manage/course/update`, params ); };

export const addCourse = params => { return axios.post(`${base}/web/manage/course/add`, params ); };

export const getCourseList = params => { return axios.get(`${base}/web/manage/course/all`, { params: params }); };


/**
 * NewsApi
 */

export const getNewsListPage = params => {return axios.get(`${base}/web/manage/news/list`, { params: params });};

export const removeNews = params => { return axios.delete(`${base}/web/manage/news/delete`, { params: params }); };

export const batchRemoveNews = params => { return axios.delete(`${base}/web/manage/news/delete`, { params: params }); };

export const editNews = params => { return axios.put(`${base}/web/manage/news/update`, params ); };

export const addNews = params => { return axios.post(`${base}/web/manage/news/add`, params ); };

/**
 * QuestionApi
 */
export const getQuestionListPage = params => {return axios.get(`${base}/web/manage/question/list`, { params: params });};

export const removeQuestion = params => { return axios.delete(`${base}/web/manage/question/delete`, { params: params }); };

export const batchRemoveQuestion = params => { return axios.delete(`${base}/web/manage/question/delete`, { params: params }); };

export const editTrueFalse = params => { return axios.put(`${base}/web/manage/trueFalse/update`, params ); };

export const addTrueFalse = params => { return axios.post(`${base}/web/manage/trueFalse/add`, params ); };

export const editSimpleChoice = params => { return axios.put(`${base}/web/manage/simpleChoice/update`, params ); };

export const addSimpleChoice = params => { return axios.post(`${base}/web/manage/simpleChoice/add`, params ); };

export const editMultipleChoice = params => { return axios.put(`${base}/web/manage/multipleChoice/update`, params ); };

export const addMultipleChoice = params => { return axios.post(`${base}/web/manage/multipleChoice/add`, params ); };

export const getQuestionList = params => {return axios.get(`${base}/web/manage/question/all`, { params: params });};

/**
 * ExamApi
 */
export const getExamListPage = params => {return axios.get(`${base}/web/manage/exam/list`, { params: params });};

export const removeExam = params => { return axios.delete(`${base}/web/manage/exam/delete`, { params: params }); };

export const batchRemoveExam = params => { return axios.delete(`${base}/web/manage/exam/delete`, { params: params }); };

export const editExam = params => { return axios.put(`${base}/web/manage/exam/update`, params ); };

export const addExam = params => { return axios.post(`${base}/web/manage/exam/add`, params ); };

/**
 * BannerApi
 */
export const getBannerList = params => {return axios.get(`${base}/web/manage/banner/list`, { params:params });};

export const saveBannerList = params => {return axios.post(`${base}/web/manage/banner/save`, params);};

/**
 * LawApi
 */
export const getLawListPage = params => {return axios.get(`${base}/web/manage/law/list`, { params: params });};

export const removeLaw = params => { return axios.delete(`${base}/web/manage/law/delete`, { params: params }); };

export const batchRemoveLaw = params => { return axios.delete(`${base}/web/manage/law/delete`, { params: params }); };

export const editLaw = params => { return axios.put(`${base}/web/manage/law/update`, params ); };

export const addLaw = params => { return axios.post(`${base}/web/manage/law/add`, params ); };

/**
 * uploadApi
 */
export const uploadFile = params => {return axios.post(`${base}/upload`, { params: params }); };

/**
 * upgradeApi
 */
export const sevenZip = params => {return axios.put(`${base}/api/sevenZip`, { params: params }); };

/**
 * unitApi
 */
export const getUnitListPage = params => {return axios.get(`${base}/web/manage/unit/list`, { params: params });};

export const removeUnit = params => { return axios.delete(`${base}/web/manage/unit/delete`, { params: params }); };

export const batchRemoveUnit = params => { return axios.delete(`${base}/web/manage/unit/delete`, { params: params }); };

export const editUnit = params => { return axios.put(`${base}/web/manage/unit/update`, params ); };

export const addUnit = params => { return axios.post(`${base}/web/manage/unit/add`, params ); };

export const getUnitList = params => {return axios.get(`${base}/web/manage/unit/all`, { params: params });};

/**
 * userApi
 */
export const getUserListPage = params => {return axios.get(`${base}/web/manage/user/list`, { params: params });};

export const removeUser = params => { return axios.delete(`${base}/web/manage/user/delete`, { params: params }); };

export const batchRemoveUser = params => { return axios.delete(`${base}/web/manage/user/delete`, { params: params }); };

export const editUser = params => { return axios.put(`${base}/web/manage/user/update`, params ); };

export const addUser = params => { return axios.post(`${base}/web/manage/user/add`, params ); };

/**
 * roleApi
 */
export const getRoleList = params => {return axios.get(`${base}/web/manage/role/list`, { params: params });};

/**
 * reviewApi
 */
export const getReviewListPage = params => {return axios.get(`${base}/web/manage/review/list`, { params: params });};
export const commitReview = params => { return axios.put(`${base}/web/manage/review/update`, params ); };

