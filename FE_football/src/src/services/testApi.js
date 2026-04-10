import instance from "../lib/axios";

export async function testApi() {
  try {
    const response = await instance.get("/test");
    return response.data;
  } catch (error) {
    console.error("Error fetching test data:", error);
    throw error;
  }

}
