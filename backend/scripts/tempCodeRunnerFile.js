  await Blog.updateMany({}, { is_updated: false, updated_content: "" });
        console.log("Database reset: All articles are ready for processing again.");    
