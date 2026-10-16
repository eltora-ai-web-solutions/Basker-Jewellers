const https = require('https');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  try {
    const html = await new Promise((resolve, reject) => {
      https.get('https://www.livechennai.com/gold_silverrate.asp', {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 12000
      }, r => {
        let data = '';
        r.setEncoding('utf8');
        r.on('data', chunk => data += chunk);
        r.on('end', () => r.statusCode === 200 ? resolve(data) : reject(new Error('Source unavailable')));
      }).on('timeout', function () {
        this.destroy(new Error('Request timed out'));
      }).on('error', reject);
    });

    const goldTable = (html.match(/<table[^>]*class=["'][^"']*gold-rates[^"']*["'][^>]*>[\s\S]*?<\/table>/i) || [])[0] || '';
    const silverTable = (html.match(/<table[^>]*class=["'][^"']*silver-rates[^"']*["'][^>]*>[\s\S]*?<\/table>/i) || [])[0] || '';

    const text = html
      .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/\s+/g, ' ');

    const goldText = goldTable.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ');
    const gold = [...goldText.matchAll(/(\d{2}\/[A-Za-z]{3}\/\d{4})\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)/g)];
    const silverText = silverTable.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ');
    const silver = [...silverText.matchAll(/(\d{2}\/[A-Za-z]{3}\/\d{4})\s+([\d,]+\.\d{2})\s+([\d,]+\.\d{2})/g)];

    const update = text.match(/Last Update Time:\s*(\d{1,2}\/\d{1,2}\/\d{4}\s+\d{1,2}:\d{2}:\d{2}\s*[AP]M)/i);

    const number = value => Number(value.replace(/,/g, ''));

    if (!gold.length || !silver.length) throw new Error('Could not parse rate table');

    res.status(200).json({
      gold22: number(gold[0][4]),
      prevGold22: gold[1] ? number(gold[1][4]) : null,
      silver: number(silver[0][2]),
      prevSilver: silver[1] ? number(silver[1][2]) : null,
      updated: update ? update[1] : '',
      source: 'LiveChennai'
    });
  } catch (error) {
    res.status(502).json({ error: 'Live rates temporarily unavailable' });
  }
};
