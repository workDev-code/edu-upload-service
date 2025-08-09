import {defaultMimeTypes} from "../constants/mimeTypes.js";
import 'dotenv/config'; 

/**
 * Lấy danh sách MIME types từ biến môi trường theo key
 * @param {string} envKey - tên biến môi trường
 * @returns {string[]} Mảng các MIME type, hoặc mảng rỗng nếu không có
*/

// truyền key vào hàm 
// trả ra mảng string
// input: image/jpeg, image/png, image/gif, image/webp, image/svg+xml
// output ['image/jpeg', 'image/png', ' image/webp'...]



// validate key
const isValidEnvKey = (key) => key && key.trim() !== '';
// lấy giá trị từ env
const getValueFromEnv = (key) =>  process.env[envKey] || '';
// chuẩn hóa giá trị
// 3. Chuyển chuỗi MIME types thành mảng sạch
// const parseMimeTypes = (valueStr) => {
//     return valueStr
//                 .split(',')
//                 .map(el => el.trim())
//                 .filter(Boolean);    
// }

const getMimeTypesFromEnv = (envKey) => {
    // check key
    if (!isValidEnvKey(envKey)) {
        return [];
    }
    const mimeTypesString = getValueFromEnv(envKey); 
    // check noi dung
    if (!mimeTypesString.trim()) return [];
   
    // loại bỏ khoảng trắng [ 'image/jpeg', ' image/png', ' image/gif' ]
    const mimeTypesArr = mimeTypesString
        .split(',')                 // Tách chuỗi thành mảng dựa vào dấu phẩy
        .map(el => el.trim())        // Xóa khoảng trắng thừa ở đầu/cuối mỗi phần tử
        // Ví dụ sau 2 bước trên: ["image/jpeg", "", "image/png", "", "", "image/webp"]
        .filter(Boolean);            // Loại bỏ phần tử rỗng (""),
                                    // null, undefined hoặc giá trị falsy khác
                                    // => Chỉ giữ lại MIME type hợp lệ
    console.log(mimeTypesArr);
    return mimeTypesArr;
}

// tại sao nên cho vào object?
export const allowMimeType = {
    image: getMimeTypesFromEnv('ALLOWED_MIME_TYPES_IMAGE'),
    video: getMimeTypesFromEnv('ALLOWED_MIME_TYPES_VIDEO'),
    audio: getMimeTypesFromEnv('ALLOWED_MIME_TYPES_AUDIO'),
    document: getMimeTypesFromEnv('ALLOWED_MIME_TYPES_DOCUMENT'),
};

console.log(JSON.stringify(allowMimeType, null, 2));
// Ví dụ gọi
// getMimeTypesFromEnv('ALLOWED_MIME_TYPES_IMAGE');
// getMimeTypesFromEnv('ALLOWED_MIME_TYPES_VIDEO');
// getMimeTypesFromEnv('ALLOWED_MIME_TYPES_AUDIO');
// getMimeTypesFromEnv('ALLOWED_MIME_TYPES_DOCUMENT');