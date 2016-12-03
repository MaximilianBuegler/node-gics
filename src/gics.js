/*===========================================================================*\
 * GICS parser (Global Industry Classification Standard)
 *
 * (c) 2016 Maximilian Bügler
 *
 *===========================================================================*/

var parse = require('csv-parse/lib/sync');
var fs=require('fs');


/**
 * Load data from csv file
 **/
function loadGics(filename){

    var gicsdata=fs.readFileSync(filename,'utf8');
    gicsdata=parse(gicsdata, {trim: true}).slice(5);
    
    var gics={
        sectors:[],
        industryGroups:[],
        industries:[],
        subIndustries:[]
    };
    
    var currentSector=-1,currentIndustryGroup=-1,currentIndustry=-1,currentSubIndustry=-1;
    
    
    
    for (var i=0;i<gicsdata.length;i++){
        if (gicsdata[i][0]!==''){
            currentSector=gicsdata[i][0];
            gics.sectors.push({
                id:currentSector,
                name:gicsdata[i][1],
                Bloomberg:gicsdata[i][2]
                });
        }
        if (gicsdata[i][3]!==''){
            currentIndustryGroup=gicsdata[i][3];
            gics.industryGroups.push({
                id:currentIndustryGroup,
                sector:currentSector,
                name:gicsdata[i][4],
                Bloomberg:gicsdata[i][5]
                });
        }
        if (gicsdata[i][6]!==''){
            currentIndustry=gicsdata[i][6];
            gics.industries.push({
                id:currentIndustry,
                industryGroup:currentIndustryGroup,
                sector:currentSector,
                name:gicsdata[i][7],
                Bloomberg:gicsdata[i][8]
                });
        }        
        if (gicsdata[i][9]!==''){
            currentSubIndustry=gicsdata[i][9];
            gics.subIndustries.push({
                id:currentSubIndustry,
                industry:currentIndustry,
                industryGroup:currentIndustryGroup,
                sector:currentSector,
                name:gicsdata[i][10],
                Bloomberg:gicsdata[i][11]
                });
        }
        else{
            gics.subIndustries[gics.subIndustries.length-1].description=gicsdata[i][10];
        }
    }
    return gics;  
}

var gics=JSON.parse(fs.readFileSync('./data/gics.json','utf8'));
//loadGics('./data/gics.csv');

module.exports = {
    
    /**
     * Returns list of all sectors
     *
     **/
    getSectors: function () {
        return gics.sectors;
    },

    /**
     * Returns list of industrygroups for given sectors (or all if no sectors provided)
     *
     * @param {array} sectors list of sector ids to retrieve industry groups for, if empty, all groups are returned.
     **/
    getIndustryGroups: function (sectors) {
        if (Array.isArray(sectors) && sectors.length>0){
            var res=[];
            for (var i=0;i<gics.industryGroups.length;i++){
                for (var j=0;j<sectors.length;j++){
                    if (gics.industryGroups[i].sector==sectors[j]){
                        res.push(gics.industryGroups[i]);
                        break;
                    }
                }
            }
            return res;
        }
        return gics.industryGroups;
    },
    
    /**
     * Returns list of industries for given industry groups(or all if none provided)
     *
     * @param {array} industryGroups list of industry group ids to retrieve industries for, if empty, all industry groups are matched.
     **/
    getIndustries: function (industryGroups) {
        if (Array.isArray(industryGroups) && industryGroups.length>0){
            var res=[];
            for (var i=0;i<gics.industries.length;i++){
                for (var j=0;j<industryGroups.length;j++){
                    if (gics.industries[i].industryGroup==industryGroups[j]){
                        res.push(gics.industries[i]);
                        break;
                    }
                }
            }
            return res;
        }
        return gics.industries;
    },

    /**
     * Returns list of subindustries for given industries (or all if none provided)
     *
     * @param {array} industries list of industry ids to retrieve subindustries for, if empty, all industries are matched.
     **/
    getSubIndustries: function (industries) {
        if (Array.isArray(industries) && industries.length>0){
            var res=[];
            for (var i=0;i<gics.subIndustries.length;i++){
                for (var j=0;j<industries.length;j++){
                    if (gics.subIndustries[i].industry==industries[j]){
                        res.push(gics.subIndustries[i]);
                        break;
                    }
                }
            }
            return res;
        }
        return gics.subIndustries;        
    },

    /**
     * Returns sector matching a given keyword
     *
     * @param keyword to match. Case insensitive
     **/
    findSectors: function (keyword){
        var res=[];
        for (var i=0;i<gics.sectors.length;i++){
            var found=false;
            if (gics.sectors[i].name.toLowerCase().includes(keyword.toLowerCase())){
                res.push(gics.sectors[i]);
                
            }
            else{
                var industryGroups=module.exports.getIndustryGroups([gics.sectors[i].id]);
                
                for (var j=0;j<industryGroups.length;j++){

                    if (industryGroups[j].name.toLowerCase().includes(keyword.toLowerCase())){
                        res.push(gics.sectors[i]);
                        found=true;
                        break;
                    }
                    else{
                        var industries=module.exports.getIndustries([industryGroups[j].id]);
                        for (var k=0;k<industries.length;k++){
                            if (industries[k].name.toLowerCase().includes(keyword.toLowerCase())){
                                res.push(gics.sectors[i]);
                                found=true;
                                break;                                
                            }
                            else{
                                var subIndustries=module.exports.getSubIndustries([industries[k].id]);
                                for (var l=0;l<subIndustries.length;l++){
                                    if (subIndustries[l].name.toLowerCase().includes(keyword.toLowerCase()) || subIndustries[l].description.toLowerCase().includes(keyword.toLowerCase())){
                                        res.push(gics.sectors[i]);
                                        found=true;
                                        break;                                        
                                    }
                                }                                
                            }
                            if (found)
                                break;
                        }
                    }
                    if (found)
                        break;                    
                }
            }
        }
        return res;
    },

    /**
     * Returns industry group matching a given keyword
     *
     * @param keyword to match. Case insensitive
     **/
    findIndustryGroups: function (keyword){
        var res=[];
        
        for (var j=0;j<gics.industryGroups.length;j++){
            var found=false;
            if (gics.industryGroups[j].name.toLowerCase().includes(keyword.toLowerCase())){
                res.push(gics.industryGroups[j]);
            }
            else{
                var industries=module.exports.getIndustries([gics.industryGroups[j].id]);
                for (var k=0;k<industries.length;k++){
                    if (industries[k].name.toLowerCase().includes(keyword.toLowerCase())){
                        res.push(gics.industryGroups[j]);
                        found=true;
                        break;
                    }
                    else{
                        var subIndustries=module.exports.getSubIndustries([industries[k].id]);
                        for (var l=0;l<subIndustries.length;l++){
                            if (subIndustries[l].name.toLowerCase().includes(keyword.toLowerCase()) || subIndustries[l].description.toLowerCase().includes(keyword.toLowerCase())){
                                res.push(gics.industryGroups[j]);
                                found=true;
                                break;
                            }
                        }                                
                    }
                    if (found)
                        break;
                }
            }
        }
        return res;        
    },
    
    /**
     * Returns industry matching a given keyword
     *
     * @param keyword to match. Case insensitive
     **/
    findIndustries: function (keyword){
        var res=[];
        for (var k=0;k<gics.industries.length;k++){
            if (gics.industries[k].name.toLowerCase().includes(keyword.toLowerCase())){
                res.push(gics.industries[k]);
            }
            else{
                var subIndustries=module.exports.getSubIndustries([gics.industries[k].id]);
                for (var l=0;l<subIndustries.length;l++){
                    if (subIndustries[l].name.toLowerCase().includes(keyword.toLowerCase()) || subIndustries[l].description.toLowerCase().includes(keyword.toLowerCase())){
                        res.push(gics.industries[k]);
                        break;
                    }
                }                                
            }
        }
        return res;            
    },
    /**
     * Returns subindustry matching a given keyword
     *
     * @param keyword to match. Case insensitive
     **/
    findSubIndustries: function (keyword){
        var res=[];
        for (var l=0;l<gics.subIndustries.length;l++){
            if (gics.subIndustries[l].name.toLowerCase().includes(keyword.toLowerCase()) || gics.subIndustries[l].description.toLowerCase().includes(keyword.toLowerCase())){
                res.push(gics.subIndustries[l]);
            }
        }                                
        return res;          
    }        
};
