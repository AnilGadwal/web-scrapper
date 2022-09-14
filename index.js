const axios = require("axios");
const cheerio = require("cheerio");
const converter = require("json-2-csv")
const fs = require("fs")

const fetchTitles = async () => {
  const response = await axios.get('https://www.quill.com/hanging-file-folders/cbl/4378.html');
  const html = response.data;
  const $ = cheerio.load(html);
  const titles = [];

  $('#SKUDetailsDiv').each((_idx, el) => {
   const desc = [] 
   $(el).children('.detailsBlk').children('.pricing-buttons').children('.itemDetails').children('.skuBrowseBullets').children().each((_idx, el)=>{
    desc.push($(el).text())
   })
   const model_number = $(el).children('#ItemSrchCompare').children('.model-number').text()
   const item_number = $(el).children('#ItemSrchCompare').children('.iNumber').text()
   const item = {
    'Product Name' : $(el).children('.detailsBlk').children('.pricing-buttons').children('.itemDetails').children('h3').children('a').text().trim(' '),
    'Product Price' : $(el).children('.detailsBlk').children('.pricing-buttons').children('.price-buttons-wrap').children('.itemDetailsLeftDiv').children('.pricePh').children('strong').children('span').text(),
    'Item Number' : item_number.substring(model_number.indexOf('#') + 1).trim(' '), 
    'Model Number' : model_number.substring(model_number.indexOf('#') + 1).trim(' '), 
    'Product Category' : $('.DimensionSel').text(),
    'Product Description' : desc.toString().split(',').join(', ')
    }
    titles.length !== 10 && titles.push(item)
  })
  return titles
};

fetchTitles().then((titles) => {
  console.log(titles)
  converter.json2csv(titles, (err, csv) => {
  fs.writeFileSync('products.csv', csv);
  });
});