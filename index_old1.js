const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = process.env.PORT || 3000;

async function fetchCarrier(dot) {

    const url = "https://safer.fmcsa.dot.gov/query.asp";

    const response = await axios.get(url, {
        params: {
            searchtype: "ANY",
            query_type: "queryCarrierSnapshot",
            query_param: "USDOT",
            query_string: dot
        },
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
            "Accept":
                "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        },
        timeout: 15000
    });

    const $ = cheerio.load(response.data);

    function getValue(label) {
        const el = $(`td:contains("${label}")`).next();
        return el.text().trim();
    }

    return {
        dot,
        legal_name: getValue("Legal Name"),
        dba_name: getValue("DBA Name"),
        status: getValue("USDOT Status"),
        entity_type: getValue("Entity Type"),
        address: getValue("Physical Address"),
        phone: getValue("Phone")
    };
}

app.get("/", (req, res) => {
    res.send("Carrier API running");
});

app.get("/carrier/:dot", async (req, res) => {
    try {

        const data = await fetchCarrier(req.params.dot);

        res.json({
            success: true,
            data
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});