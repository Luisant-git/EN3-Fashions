import API_BASE_URL from "./config";

export const removeOrderItem = async (orderId, itemId) => {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/remove-item`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId }),
  });
  if (!response.ok) throw new Error('Failed to remove item');
  return await response.json();
};

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


// Get order statistics for dashboard cards
export const getOrderStats = async (startDate = '', endDate = '') => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const url = `${API_BASE_URL}/orders/admin/stats${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch order statistics');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status, invoiceUrl, packageSlipUrl, courierName, trackingId, trackingLink, cancelRemarks, codCharge, courierCharge) => {
  try {
    const body = { status };
    if (invoiceUrl) body.invoiceUrl = invoiceUrl;
    if (packageSlipUrl) body.packageSlipUrl = packageSlipUrl;
    if (courierName) body.courierName = courierName;
    if (trackingId) body.trackingId = trackingId;
    if (trackingLink) body.trackingLink = trackingLink;
    if (cancelRemarks !== undefined) body.cancelRemarks = cancelRemarks;
    if (codCharge) body.codCharge = parseFloat(codCharge);
    if (courierCharge) body.courierCharge = parseFloat(courierCharge);

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

export const pushToShiprocket = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/webhook/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to push to Shiprocket');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
