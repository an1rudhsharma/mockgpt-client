import api from './configs/axiosConfigs';

const InterviewAPI = {
    getReviewById: async (interviewId: string) => {
        const response = await api.request({
            url: `/interview-review/${interviewId}`,
            method: 'GET',
        });
        return { data: response.data.data, status: response.status };
    },
}

export default InterviewAPI