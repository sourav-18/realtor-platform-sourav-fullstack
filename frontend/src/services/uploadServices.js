import api from './api';

export const uploadService = {
    bulkImage: (images) =>
        api.post('/upload/bulk-image', images).then(res => res.data)
};