export const groupImages = (images) => {
    if (images) {
        const getRootYears = images => Object
            .keys(images)
            .filter(year => year.includes('_'))
            .map(year => year.split('_')[0]);

        const groupedImages = {};
        const rootYears = getRootYears(images);

        if (rootYears.length) {
            Object.keys(images).forEach(name => {
                if (name.includes('_')) {
                    const groupName = name.split('_')[0];
                    groupedImages[groupName] = {};
                }
            });

            Object.keys(images).forEach(name => {
                if (!name.includes('_')) {
                    try {
                        groupedImages[name][name] = images[name];
                    } catch (e) {
                        groupedImages[name] = images[name];
                    }
                } else {
                    const [n,m] = name.split('_');
                    groupedImages[n][m] = images[name];
                }
            });

            return groupedImages;
        }

        return images;
    }

    return {};
}