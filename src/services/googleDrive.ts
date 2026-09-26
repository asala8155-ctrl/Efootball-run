export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  webViewLink?: string;
  iconLink?: string;
}

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_BASE = 'https://www.googleapis.com/upload/drive/v3';

// List files from Google Drive (e.g. searching for eFootball / ExitLag backups or general files)
export async function listDriveFiles(accessToken: string, query?: string): Promise<DriveFile[]> {
  let url = `${DRIVE_API_BASE}/files?pageSize=40&fields=files(id,name,mimeType,size,modifiedTime,webViewLink,iconLink)&orderBy=modifiedTime desc`;
  if (query) {
    url += `&q=trashed=false and ${encodeURIComponent(query)}`;
  } else {
    url += `&q=trashed=false`;
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `خطا در دریافت فایل‌های گوگل درایو (${res.status})`);
  }

  const data = await res.json();
  return data.files || [];
}

// Upload a text/json config file directly to Google Drive
export async function uploadTextToDrive(
  accessToken: string,
  fileName: string,
  content: string,
  mimeType = 'application/json'
): Promise<DriveFile> {
  const metadata = {
    name: fileName,
    mimeType: mimeType,
    description: 'ExitLag Mobile & eFootball League Booster Configuration',
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${mimeType}\r\n\r\n` +
    content +
    closeDelimiter;

  const res = await fetch(`${DRIVE_UPLOAD_BASE}/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,modifiedTime`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'خطا در بارگذاری فایل در گوگل درایو');
  }

  return await res.json();
}

// Upload binary blob (such as full project zip) to Google Drive
export async function uploadBlobToDrive(
  accessToken: string,
  fileName: string,
  blob: Blob,
  mimeType = 'application/zip'
): Promise<DriveFile> {
  const metadata = {
    name: fileName,
    mimeType: mimeType,
    description: 'Full Project Source & Server Backup - ExitLag eFootball Booster',
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', blob);

  const res = await fetch(`${DRIVE_UPLOAD_BASE}/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,modifiedTime`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: form,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'خطا در بارگذاری فایل ZIP در گوگل درایو');
  }

  return await res.json();
}

// Delete file from Google Drive (MUST be confirmed by user beforehand)
export async function deleteDriveFile(accessToken: string, fileId: string): Promise<boolean> {
  const res = await fetch(`${DRIVE_API_BASE}/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok && res.status !== 204) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'خطا در حذف فایل از گوگل درایو');
  }

  return true;
}
