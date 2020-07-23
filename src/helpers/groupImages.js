export const groupImages = (images) => {
    const getRootYears = images => Object
        .keys(images)
        .filter(year => year.includes('_'))
        .map(year => year.split('_')[0]);

    const groupedImages = {};
    const rootYears = getRootYears(images);

    if (rootYears.length) {
        for (let key of Object.keys(images)) {
            for (let rootYear of rootYears) {
                if (!groupedImages[rootYear]) groupedImages[rootYear] = {};

                if (key.startsWith(rootYear)) {
                    if (key.includes('_')) {
                        const k = key.split('_')[1];
                        groupedImages[rootYear][k] = images[key];
                    } else {
                        groupedImages[rootYear][key] = images[key];
                    }
                } else {
                    groupedImages[key] = images[key];
                }
            }
        }

        return groupedImages;
    }

    return images;
}