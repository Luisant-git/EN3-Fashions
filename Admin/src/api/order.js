import API_BASE_URL from "./config";

export const fetchOrders = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/admin/all`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status, invoiceUrl, packageSlipUrl, courierName, trackingId, trackingLink) => {
  try {
    const body = { status };
    if (invoiceUrl) body.invoiceUrl = invoiceUrl;
    if (packageSlipUrl) body.packageSlipUrl = packageSlipUrl;
    if (courierName) body.courierName = courierName;
    if (trackingId) body.trackingId = trackingId;
    if (trackingLink) body.trackingLink = trackingLink;

    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Failed to update order status');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteFile = async (url) => {
  try {
    const response = await fetch(`${API_BASE_URL}/upload/file`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete file');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteOrderFiles = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/upload/order-files`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete order files');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};