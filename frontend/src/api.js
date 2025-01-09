import axios from "axios";
import { toast } from "react-toastify";
// https://github.com/creativetimofficial/light-bootstrap-dashboard-react?tab=readme-ov-file
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
const token = localStorage.getItem("token");

export const login = async (credentials) => {
  try {
    const response = await apiClient.post("auth/login", credentials);
    console.log(response);
    localStorage.setItem("token", response.data.token);
    toast.success(response.data.message, {
      autoClose: 1000,
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred during login.";
    console.log(errorMessage);
    toast.error(errorMessage, {
      autoClose: 1000,
    });
  }
};

export const signup = async (userDetails) => {
  try {
    const response = await apiClient.post("auth/signup", userDetails);

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred during signup.";
    console.log(errorMessage);
  }
};

export const signinWithGoogle = async (idToken) => {
  try {
    const response = await apiClient.post("auth/signinWithGoogle",{idToken:idToken});

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred during signup.";
    console.log(errorMessage);
  }
};

export const verifyOtp = async (userDetails) => {
  try {
    const response = await apiClient.post("auth/verifyOtp", userDetails);

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred during signup.";
    console.log(errorMessage, "MSG");
  }
};

export const resetpasswordReq = async (userDetails) => {
  try {
    const response = await apiClient.post("auth/resetpasswordOtp", userDetails);

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred during reset password.";
    console.log(errorMessage);
  }
};

export const verifyOtpAndresetpassword = async (userDetails) => {
  try {
    const response = await apiClient.post(
      "auth/verifyOtpAndresetpassword",
      userDetails
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred during reset password.";
    console.log(errorMessage, "MSG");
  }
};

export const resetpassword = async (userDetails) => {
  try {
    const response = await apiClient.post("auth/resetpassword", userDetails);
    toast.success(response.data.message, {
      autoClose: 1000,
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred during reset password.";
    console.log(errorMessage, "MSG");
  }
};

// ################################################## Invoice ##############################################

export const getInvoices = async () => {
  try {
    if (!token) {
      console.error("Authorization token is missing.");
      return null;
    }
    const response = await apiClient.get("invoice/Listinvoice", {
      headers: {
        Authorization: token,
      },
    });
    localStorage.setItem("invoicelength", response.data.length);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const createInvoice = async (credentials) => {
  try {
    const response = await apiClient.post("invoice/invoiceCreate", credentials);
    console.log(response);

    toast.success(response.data.message, {
      autoClose: 1000,
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred during create invoice.";
    console.log(errorMessage);
  }
};

export const deleteInvoice = async (invoiceId) => {
  try {
    const response = await apiClient.delete(
      `invoice/Deleteinvoice/${invoiceId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    toast.success(response.data.message, {
      autoClose: 1000,
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred during create invoice.";

    toast.error(errorMessage, {
      autoClose: 1000,
    });
  }
};

export const downloadpdfInvoice = async (invoiceId) => {
  try {
    const response = await apiClient.get(
      `invoice/invoiceDownload/${invoiceId}`
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred during create invoice.";
    console.log(errorMessage);
  }
};

export const changepaymentStatus = async (invoiceId) => {
  try {
    const response = await apiClient.patch(
      `invoice/changePaymentStatus/${invoiceId}`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred during create invoice.";
    console.log(errorMessage);
  }
};

export const searchInvoice = async (search) => {
  try {
    const response = await apiClient.get(
      `invoice/Searchinvoice?search=${search}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

export const getInvoicesFilterlist = async (query) => {
  try {
    if (!token) {
      console.error("Authorization token is missing.");
      return null;
    }
    const response = await apiClient.get(`invoice/filterlistinvoice?filter=${query}`, {
      headers: {
        Authorization: token,
      },
    });
    console.log(response,"responselist");
    
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// ##################################################### Company #################################################

export const createCompany = async (credentials) => {
  try {
    const response = await apiClient.post("company/companyCreate", credentials);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred during create company.";
    console.log(errorMessage);
  }
};

// ############################################################ USER #########################################################
export const updateUser = async (userId, data) => {
  try {
    const response = await apiClient.put(`user/userUpdate/${userId}`, data, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred during update user.";
    console.log(errorMessage);
  }
};
