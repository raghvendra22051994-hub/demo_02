const cheerio = require("cheerio");

async function fetchData() {
    const response = await fetch(
        "https://safer.fmcsa.dot.gov/query.asp?searchtype=ANY&query_type=queryCarrierSnapshot&query_param=USDOT&query_string=3519974"
    );

    const html = await response.text();

    const $ = cheerio.load(html);

    let data = {
        dot: "3519974",
        legal_name: "",
        dba_name: "",
        status: "",
        entity_type: "",
        address: "",
        phone: ""
    };

    $("table tr").each((i, el) => {
        const label = $(el).find("td").first().text().trim();
        const value = $(el).find("td").eq(1).text().trim();

        if (label.includes("Legal Name")) data.legal_name = value;
        if (label.includes("DBA Name")) data.dba_name = value;
        if (label.includes("Carrier Operation")) data.entity_type = value;
        if (label.includes("Phone")) data.phone = value;
        if (label.includes("Physical Address")) data.address = value;
        if (label.includes("Operating Status")) data.status = value;
    });

    console.log(data);
}

fetchData();