import { server } from "@/auth/server";
import { WhiteBoardCreateFormData } from "@/types/WhiteBoard";

export const createWhiteBoard = async (whiteBoardData: WhiteBoardCreateFormData) => {
    try {
        const res = await server.post("/whiteboards", whiteBoardData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error creating whiteboard:", error);
        throw error;
    }
};