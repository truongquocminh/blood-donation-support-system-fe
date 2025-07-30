import { apiGet, apiPost, apiPut, apiDelete } from "./api";

const BLOG_ENDPOINTS = {
  GET_BLOGS: "/blogs",
  CREATE_BLOG: "/blogs",
  UPDATE_BLOG: "/blogs",
  DELETE_BLOG: "/blogs",
  GET_MY_BLOGS: "/blogs/my-blogs",
};

export const getAllBlogs = async (page = 0, size = 100) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString()
  });

  return apiGet(`${BLOG_ENDPOINTS.GET_BLOGS}?${params.toString()}`);
};

export const getMyBlogs = async (page = 0, size = 100) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString()
  });

  return apiGet(`${BLOG_ENDPOINTS.GET_MY_BLOGS}?${params.toString()}`);
};

export const createBlogs = async (blogData) => {
  const requestBody = {
    title: blogData.title,
    content: blogData.content,
  };

  return apiPost(BLOG_ENDPOINTS.CREATE_BLOG, requestBody);
};

export const updateBlogById = async (id, blogData) => {
  const requestBody = {
    title: blogData.title,
    content: blogData.content,
  };

  return apiPut(`${BLOG_ENDPOINTS.UPDATE_BLOG}/${id}`, requestBody);
};

export const deleteBlogById = async (id) => {
  return apiDelete(`${BLOG_ENDPOINTS.DELETE_BLOG}/${id}`);
};

export default {
  getAllBlogs,
  getMyBlogs,
  createBlogs,
  updateBlogById,
  deleteBlogById,
};