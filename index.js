/*===========================================================================*\
 *
 * Autocorrelation based on FFT
 *
 * (c) 2016 Maximilian Bügler
 *
\*===========================================================================*/
module.exports = {
    getSectors: require('./src/gics').getSectors,
    getIndustryGroups: require('./src/gics').getIndustryGroups,
    getIndustries: require('./src/gics').getIndustries,
    getSubIndustries: require('./src/gics').getSubIndustries,
    findSectors: require('./src/gics').findSectors,
    findIndustryGroups: require('./src/gics').findIndustryGroups,
    findIndustries: require('./src/gics').findIndustries,
    findSubIndustries: require('./src/gics').findSubIndustries
};
