/*===========================================================================*\
 * Autocorrelation algorithm based on description by Thibauld Nion
 * http://www.tibonihoo.net/literate_musing/autocorrelations.html
 *
 * (c) 2016 Maximilian Bügler
 *
 * Test setup adapted from fft-js in https://github.com/vail-systems/node-fft
 * (c) Vail Systems. Joshua Jung and Ben Bryan. 2015
 *
 *===========================================================================*/



var assert = require('assert'),
    gics = require('../');

describe('Find', function () {

    describe('Oil sectors', function () {
        it('Should find sectors involving oil', function () {
            var res = gics.findSectors('oil');
            assert.equal(res[0].id,10);
            assert.equal(res[1].id,45);
            assert.equal(res[2].id,55);
            assert.equal(res.length,3);
        });
    });
    describe('Drugs sectors', function () {
        it('Should find sectors involving drugs', function () {
            var res = gics.findSectors('drugs');
            assert.equal(res[0].id,35);
            assert.equal(res.length,1);
        });
    });
    
    describe('Oil industry groups', function () {
        it('Should find industry groups involving oil', function () {
            var res = gics.findIndustryGroups('oil');
            assert.equal(res[0].id,1010);
            assert.equal(res[1].id,4520);
            assert.equal(res[2].id,5510);
            assert.equal(res.length,3);
        });
    });
    describe('Drugs industry groups', function () {
        it('Should find industry groups involving drugs', function () {
            var res = gics.findIndustryGroups('drugs');
            assert.equal(res[0].id,3520);
            assert.equal(res.length,1);
        });
    });
    
    describe('Oil industries', function () {
        it('Should find industries involving oil', function () {
            var res = gics.findIndustries('oil');
            assert.equal(res[0].id,101010);
            assert.equal(res[1].id,101020);
            assert.equal(res[2].id,452030);
            assert.equal(res[3].id,551020);
            assert.equal(res.length,4);
        });
    });
    describe('Drugs industries', function () {
        it('Should find industries involving drugs', function () {
            var res = gics.findIndustries('drugs');
            assert.equal(res[0].id,352020);
            assert.equal(res.length,1);
        });
    });
    
        describe('Oil subindustries', function () {
        it('Should find subindustries involving oil', function () {
            var res = gics.findSubIndustries('oil');
            assert.equal(res[0].id,10101010);
            assert.equal(res[1].id,10101020);
            assert.equal(res[2].id,10102010);
            assert.equal(res[3].id,10102020);
            assert.equal(res[4].id,10102030);
            assert.equal(res[5].id,10102040);
            assert.equal(res[6].id,45203015);
            assert.equal(res[7].id,55102010);
            assert.equal(res.length,8);
        });
    });
    describe('Drugs subindustries', function () {
        it('Should find subindustries involving drugs', function () {
            var res = gics.findSubIndustries('drugs');
            assert.equal(res[0].id,35202010);
            assert.equal(res.length,1);
        });
    });


});
