export const handleImagePreview = (
    inputRef: React.RefObject<HTMLInputElement>,
    previewRef: React.RefObject<HTMLImageElement>
) => {
    if (inputRef.current && previewRef.current && inputRef.current.files) {
        const file = inputRef.current.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                previewRef.current!.src = reader.result as string;
            };
            reader.readAsDataURL(file);
            previewRef.current.style.display = 'inline-block'
        } else {
            // Reset preview if the file is not an image
            previewRef.current.src = '';
            previewRef.current.style.display = 'none'
        }
    }
};


export const handleImagePreviewCancel = (
    inputRef: React.RefObject<HTMLInputElement>,
    previewRef: React.RefObject<HTMLImageElement>
) => {
    if (inputRef.current && previewRef.current && inputRef.current.files) {
        inputRef.current.files = null;
        // Reset preview if the file is not an image
        previewRef.current.src = '';
        previewRef.current.style.display = 'none'

    }
};



export const handleMultipleImagePreview = (
    inputRef: React.RefObject<HTMLInputElement>,
    previewContainerRef: React.RefObject<HTMLDivElement>
) => {
    if (inputRef.current && previewContainerRef.current && inputRef.current.files) {
        const files = Array.from(inputRef.current.files);

        // Clear the previous previews
        previewContainerRef.current.innerHTML = '';

        files.forEach((file) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = () => {
                    // Create a new image element and set its source to the file's data URL
                    const img = document.createElement('img');
                    img.src = reader.result as string;
                    img.style.maxWidth = '100px';
                    img.style.margin = '5px';
                    img.style.height = 'auto';
                    img.style.objectFit = 'cover';
                    previewContainerRef.current!.appendChild(img);
                };

                reader.readAsDataURL(file);
            }
        });
    }
};

export const handleMultipleImagePreviewCancel = (
    inputRef: React.RefObject<HTMLInputElement>,
    previewContainerRef: React.RefObject<HTMLDivElement>
) => {
    if (inputRef.current && previewContainerRef.current && inputRef.current.files) {
        inputRef.current.files = null
        // Clear the previous previews
        previewContainerRef.current.innerHTML = '';

    }
};
