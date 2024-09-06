export const configData = {
    pages: [
        {url: "https://www.insight.com/en_US/home.html", history: []},
        {url: "https://www.uk.insight.com/en-gb/home.html", history: []}
    ],

    groups: [
        {
            title: "All",
            indicator: "roundrect:∞:.c-grouptag--all",
            website: "https://insight.com/",
            coordinator: {
                name: "Insight 1",
                email: "someone@insight.com",
            },
            contact: {
                name: "",
                email: "",
                phone: ""
            },
            query: function(d) {
                return true;
            }
        },
        {
            title: "Insight",
            indicator: "roundrect:I:.c-grouptag--insight",
            website: "https://www.insight.com/",
            description: "Find the right online shoppers",
            coordinator: {
                name: "Insight 1",
                email: "someone@insight.com",
            },
            contact: {
                name: "Insight 1",
                email: "someone@adroll.com",
            },
            query: function(d) {
                let hosts = ["insight.com","nsit.com"];
                let url = new URL(d.request.url);
                return hosts.some((d) => url.hostname.toLowerCase().endsWith(d));
            }
        },
        {
            title: "Insight Images",
            indicator: "roundrect:II:.c-grouptag--insight-images",
            website: "https://www.insight.com/",
            description: "Find the right online shoppers",
            coordinator: {
                name: "Insight 1",
                email: "someone@insight.com",
            },
            contact: {
                name: "Insight 1",
                email: "someone@adroll.com",
            },
            query: function(d) {
                let hosts = ["insight.com","nsit.com"];
                let url = new URL(d.request.url);
                let mimeType = d.response.content.mimeType;
                return hosts.some((d) => url.hostname.toLowerCase().endsWith(d) && mimeType.toLowerCase().startsWith("image"));
            }
        },
        {
            title: "Adobe Target",
            indicator: "roundrect:AT:white:#4EB7E1",
            website: "https://market.adobe.com/",
            description: "Find the right online shoppers",
            coordinator: {
                name: "Sara Robson",
                email: "Michael.Tolmie@insight.com"
            },
            contact: {
                company: "Rich Relevance",
                name: "",
                email: ""
            },
            query: function(d) {
                let hosts = ["omtrdc.net"];
                let url = new URL(d.request.url);
                return hosts.some((d) => url.hostname.toLowerCase().endsWith(d));
            }
        },
        {
            title: "Adobe Typekit",
            indicator: "rect:Tk:#87ec00:#1B2C05:#87ec00",
            website: "https://www.richrelevance.com/",
            description: "Find the right online shoppers",
            coordinator: {
                name: "Sara Robson",
                email: "Michael.Tolmie@insight.com"
            },
            contact: {
                company: "Rich Relevance",
                name: "",
                email: ""
            },
            query: function(d) {
                let hosts = ["typekit.net"];
                let url = new URL(d.request.url);
                return hosts.some((d) => url.hostname.toLowerCase().endsWith(d));
            }
        },
        {
            title: "AdRoll",
            indicator: "roundrect:AR:white:#00aeef",
            website: "https://www.adroll.com/",
            description: "Find the right online shoppers",
            coordinator: {
                name: "Insight 1",
                email: "someone@insight.com",
            },
            contact: {
                name: "Adroll 1",
                email: "someone@adroll.com",
            },
            query: function(d) {
                let hosts = ["adroll.com"];
                let url = new URL(d.request.url);
                return hosts.some((d) => url.hostname.toLowerCase().endsWith(d));
            }
        },
        {
            title: "c|net",
            indicator: "round:c|n:white:#AF1A13",
            website: "https://www.cnetcontent.com/",
            description: "Find the right online shoppers",
            coordinator: {
                name: "Insight 1",
                email: "someone@insight.com",
            },
            contact: {
                name: "Adroll 1",
                email: "someone@adroll.com",
            },
            query: function(d) {
                let hosts = ["cnetcontent.com"];
                let url = new URL(d.request.url);
                return hosts.some((d) => url.hostname.toLowerCase().endsWith(d));
            }
        },
        {
            title: "DoubleClick",
            indicator: "roundrect:DC:white:green",
            website: "https://analytics.google.com/",
            coordinator: {
                name: "Insight 1",
                email: "someone@insight.com",
            },
            contact: {
                name: "",
                email: "",
                phone: ""
            },
            query: function(d) {
                let hosts = ["doubleclick.net"]
                let url = new URL(d.request.url);
                let initiatorMatch = false;
                let initiator = d._initiator;
                if ((typeof initiator === "string") && initiator.indexOf("doubleclick.net")>=0) initiatorMatch = true;
                return hosts.some((d) => url.hostname.toLowerCase().endsWith(d)) || initiatorMatch;
            }
        },
        {
            title: "Google",
            indicator: "roundrect:G:.c-grouptag--google",
            website: "https://analytics.google.com/",
            coordinator: {
                name: "Insight 1",
                email: "someone@insight.com",
            },
            contact: {
                name: "",
                email: "",
                phone: ""
            },
            query: function(d) {
                let hosts = [".google.com","google-analytics.com","googleadservices.com","googleapis.com","googletagmanager.com"]
                let url = new URL(d.request.url);
                return hosts.some((d) => url.hostname.toLowerCase().endsWith(d));
            }
        },
        {
            title: "hotjar",
            indicator: "roundrect:HJ:white:#EA3F50",
            website: "https://www.hotjar.com/",
            description: "Find the right online shoppers",
            coordinator: {
                name: "Insight 1",
                email: "someone@insight.com",
            },
            contact: {
                name: "Adroll 1",
                email: "someone@adroll.com",
            },
            query: function(d) {
                let hosts = ["hotjar.com"];
                let url = new URL(d.request.url);
                return hosts.some((d) => url.hostname.toLowerCase().endsWith(d));
            }
        },
        {
            title: "KRXD",
            indicator: "roundrect:KR:white:#888800",
            website: "https://www.richrelevance.com/",
            description: "Find the right online shoppers",
            coordinator: {
                name: "Sara Robson",
                email: "Michael.Tolmie@insight.com"
            },
            contact: {
                company: "Rich Relevance",
                name: "",
                email: ""
            },
            query: function(d) {
                let hosts = ["krxd.net"];
                let url = new URL(d.request.url);
                return hosts.some((d) => url.hostname.toLowerCase().endsWith(d));
            }
        },
        {
            title: "Live Person",
            indicator: "roundrect:LP:white:#6969D8",
            description: "",
            contact: {
                name: "",
                email: "",
                phone: ""
            },
            query: function(d) {
                let hosts = ["liveperson.net","lpsnmedia.net"];
                let url = new URL(d.request.url);
                return hosts.some((d) => url.hostname.toLowerCase().endsWith(d));
            }
        },
        {
            title: "Marketo",
            indicator: "roundrect:MK:white:blue",
            description: "",
            contact: {
                name: "",
                email: "",
                phone: ""
            },
            query: function(d) {
                let hosts = ["marketo.com","marketo.net","mktoresp.com"];
                let url = new URL(d.request.url);
                return hosts.some((d) => url.hostname.toLowerCase().endsWith(d));
            }
        },
        {
          title: "mPulse",
          indicator: "rect:mP:white:#51A1E0",
          description: "",
          contact: {
            name: "",
            email: "",
            phone: ""
          },
          query: function(d) {
            let hosts = ["go-mpulse.net"];
            let url = new URL(d.request.url);
            return hosts.some((d) => url.hostname.toLowerCase().endsWith(d));
          }
        },
        {
            title: "MRP",
            indicator: "roundrect:MR:white:#31507A",
            description: "",
            contact: {
                name: "",
                email: "",
                phone: ""
            },
            query: function(d) {
                let hosts = ["mrpfd.com"];
                let url = new URL(d.request.url);
                return hosts.some((d) => url.hostname.toLowerCase().endsWith(d));
            }
        },
        {
            title: "Rich Relevance",
            indicator: "roundrect:RR:white:gray",
            website: "https://www.richrelevance.com/",
            description: "Find the right online shoppers",
            coordinator: {
                name: "Sara Robson",
                email: "Michael.Tolmie@insight.com"
            },
            contact: {
                company: "Rich Relevance",
                name: "",
                email: ""
            },
            query: function(d) {
                let hosts = ["richrelevance.com"];
                let url = new URL(d.request.url);
                return hosts.some((d) => url.hostname.toLowerCase().endsWith(d));
            }
        },
        {
            title: "Usabilla",
            indicator: "roundrect:US:white:#419EC7",
            website: "https://www.usabilla.com/",
            description: "Find the right online shoppers",
            coordinator: {
                name: "Sara Robson",
                email: "Michael.Tolmie@insight.com"
            },
            contact: {
                company: "Usabilla",
                name: "",
                email: ""
            },
            query: function(d) {
                let hosts = ["usabilla.com"];
                let url = new URL(d.request.url);
                return hosts.some((d) => url.hostname.toLowerCase().endsWith(d));
            }
        },
        {
            title: "Vimeo",
            indicator: "roundrect:VM:white:#23303C:gray",
            website: "https://analytics.google.com/",
            coordinator: {
                name: "Insight 1",
                email: "someone@insight.com",
            },
            contact: {
                name: "",
                email: "",
                phone: ""
            },
            query: function(d) {
                let hosts = ["vimeo.com"]
                let url = new URL(d.request.url);
                return hosts.some((d) => url.hostname.toLowerCase().endsWith(d));
            }
        },
    ],
}
