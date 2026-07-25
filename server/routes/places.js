import express from "express";

const router = express.Router();

const overpassServers = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
];

/**
 * Fetch nearby tourist places from Overpass.
 */
async function requestOverpass(query) {
    let lastError;

    for (const url of overpassServers) {
        try {
            const body = new URLSearchParams();
            body.append("data", query);

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "User-Agent": "AllTrail-Portfolio-Project/1.0",
                },
                body: body.toString(),
            });

            const text = await response.text();

            if (!response.ok) {
                throw new Error(`Overpass returned status ${response.status}`);
            }

            return JSON.parse(text);
        } catch (error) {
            console.error(`Overpass error from ${url}:`, error.message);
            lastError = error;
        }
    }

    throw lastError || new Error("All Overpass servers failed");
}

/**
 * Fetch one matching Wikipedia article.
 *
 * The MediaWiki Action API is used because it can return:
 * - search results
 * - short extracts
 * - page images
 * - article URLs
 */
async function getWikipediaData(place) {
    try {
        const name = place.tags?.name;

        if (!name) {
            return null;
        }

        /*
         * Some OpenStreetMap places contain a wikipedia tag such as:
         * en:India Gate
         *
         * When available, use that title because it is more reliable
         * than searching only by the place name.
         */
        const wikipediaTag = place.tags?.wikipedia;

        let searchText = name;

        if (wikipediaTag?.includes(":")) {
            searchText = wikipediaTag.split(":").slice(1).join(":");
        } else {
            const city =
                place.tags?.["addr:city"] ||
                place.tags?.["addr:district"] ||
                "";

            searchText = `${name} ${city}`.trim();
        }

        const params = new URLSearchParams({
            action: "query",
            format: "json",
            origin: "*",

            generator: "search",
            gsrsearch: searchText,
            gsrnamespace: "0",
            gsrlimit: "1",

            prop: "extracts|pageimages|info",
            exintro: "1",
            explaintext: "1",
            exsentences: "3",

            piprop: "thumbnail|original",
            pithumbsize: "600",

            inprop: "url",
            redirects: "1",
        });

        const response = await fetch(
            `https://en.wikipedia.org/w/api.php?${params.toString()}`,
            {
                headers: {
                    "Api-User-Agent": "AllTrail-Portfolio-Project/1.0",
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Wikipedia returned status ${response.status}`);
        }

        const data = await response.json();
        const pages = data.query?.pages;

        if (!pages) {
            return null;
        }

        const page = Object.values(pages)[0];

        if (!page) {
            return null;
        }

        return {
            wikipediaTitle: page.title || null,
            description: page.extract || null,
            image:
                page.thumbnail?.source ||
                page.original?.source ||
                null,
            wikipediaUrl: page.fullurl || null,
        };
    } catch (error) {
        console.error(
            `Wikipedia error for ${place.tags?.name}:`,
            error.message
        );

        // Wikipedia failure should not break the whole places request.
        return null;
    }
}

/**
 * Run async functions with a concurrency limit.
 * This avoids making too many Wikipedia requests simultaneously.
 */
async function mapWithConcurrency(items, limit, callback) {
    const results = new Array(items.length);
    let nextIndex = 0;

    async function worker() {
        while (nextIndex < items.length) {
            const currentIndex = nextIndex;
            nextIndex += 1;

            results[currentIndex] = await callback(
                items[currentIndex],
                currentIndex
            );
        }
    }

    const workerCount = Math.min(limit, items.length);

    await Promise.all(
        Array.from({ length: workerCount }, () => worker())
    );

    return results;
}

router.get("/", (req, res) => {
    res.json({
        message: "Places route is working",
    });
});

router.post("/nearby", async (req, res) => {
    try {
        const lat = Number(req.body.lat);
        const lng = Number(req.body.lng);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            return res.status(400).json({
                error: "Valid latitude and longitude are required",
            });
        }

        const query = `
      [out:json][timeout:25];
      (
        node["tourism"~"attraction|museum|viewpoint|gallery|zoo|theme_park"]
          (around:5000,${lat},${lng});

        way["tourism"~"attraction|museum|viewpoint|gallery|zoo|theme_park"]
          (around:5000,${lat},${lng});

        relation["tourism"~"attraction|museum|viewpoint|gallery|zoo|theme_park"]
          (around:5000,${lat},${lng});

        node["leisure"~"park|nature_reserve"]
          (around:5000,${lat},${lng});

        way["leisure"~"park|nature_reserve"]
          (around:5000,${lat},${lng});

        node["natural"~"waterfall|peak"]
          (around:5000,${lat},${lng});
      );
      out center tags;
    `;

        const overpassData = await requestOverpass(query);

        const basicPlaces = (overpassData.elements || [])
            .filter((place) => place.tags?.name)
            .map((place) => ({
                id: place.id,
                type: place.type,

                lat: place.lat ?? place.center?.lat,
                lon: place.lon ?? place.center?.lon,

                tags: place.tags,
            }))
            .filter(
                (place) =>
                    Number.isFinite(place.lat) &&
                    Number.isFinite(place.lon)
            )
            // Keep the first request reasonably small.
            .slice(0, 15);

        const enrichedPlaces = await mapWithConcurrency(
            basicPlaces,
            3,
            async (place) => {
                const wikipedia = await getWikipediaData(place);

                return {
                    ...place,

                    name: place.tags?.name || "Unnamed place",

                    category:
                        place.tags?.tourism ||
                        place.tags?.leisure ||
                        place.tags?.natural ||
                        "tourist attraction",

                    description:
                        wikipedia?.description ||
                        place.tags?.description ||
                        "No description is available for this place.",

                    image: wikipedia?.image || null,

                    wikipediaTitle:
                        wikipedia?.wikipediaTitle || null,

                    wikipediaUrl:
                        wikipedia?.wikipediaUrl || null,
                };
            }
        );

        return res.json(enrichedPlaces);
    } catch (error) {
        console.error("Nearby places error:", error);

        return res.status(503).json({
            error:
                "Could not load nearby tourist places. Please try again after a few seconds.",
            details: error.message,
        });
    }
});

export default router;