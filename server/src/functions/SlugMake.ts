const SlugMaker = (str: string): string => {
    return str
        .toLowerCase()                    // Convert to lowercase
        .trim()                            // Remove whitespace from both ends
        .replace(/[^a-z0-9\s-]/g, "")      // Remove special characters
        .replace(/\s+/g, "-")              // Replace spaces with hyphens
        .replace(/-+/g, "-");              // Replace multiple hyphens with a single one
}



export default SlugMaker