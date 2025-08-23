const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      reject(new Error('Only JPEG and PNG files are allowed'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      reject(new Error('File size should be less than 5MB'));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default convertToBase64;
