// Replace with your EC2 public domain
const API_URL = 'http://ec2-3-145-76-118.us-east-2.compute.amazonaws.com';

export const sendMessage = async (message) => {
    try {
        const response = await fetch(`${API_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}; 