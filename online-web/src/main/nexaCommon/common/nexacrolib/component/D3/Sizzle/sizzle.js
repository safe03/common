﻿/*!
 * Sizzle CSS Selector Engine v@VERSION
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: @DATE
 */
(function(_eco)
{

    var i,
        support,
        Expr,
        getText,
        isXML,
        compile,
        select,
        outermostContext,
        sortInput,
        hasDuplicate,

        // Local root vars
        setRoot,
        _root,
        matches,
        contains = function(a, b)
        {
            if (b)
            {
                while (b = b.Parent)
                {
                    if (b === a) return true;
                }
            }
            return false;
        },

        // Instance-specific data
        expando = "sizzle" + -(new Date()),
        dirruns = 0,
        done = 0,
        classCache = createCache(),
        tokenCache = createCache(),
        compilerCache = createCache(),
        sortOrder = function(a, b)
        {
            if (a === b)
            {
                hasDuplicate = true;
                return 0;
            }
            var cur,
                i = 0,
                aup = a.Parent,
                bup = b.Parent,
                ap = [a],
                bp = [b];

            // Parentless nodes are either documents or disconnected
            if (!aup || !bup)
            {
                return a === _root ? -1 :
                    b === _root ? 1 :
                    aup ? -1 :
                    bup ? 1 :
                    sortInput ?
                    (indexOf.call(sortInput, a) - indexOf.call(sortInput, b)) :
                    0;

                // If the nodes are siblings, we can do a quick check
            }
            else if (aup === bup)
            {
                return siblingCheck(a, b);
            }

            // Otherwise we need full lists of their ancestors for comparison
            cur = a;
            while ((cur = cur.Parent))
            {
                ap.unshift(cur);
            }
            cur = b;
            while ((cur = cur.Parent))
            {
                bp.unshift(cur);
            }

            // Walk down the tree looking for a discrepancy
            while (ap[i] === bp[i])
            {
                i++;
            }

            return i ?
                // Do a sibling check if the nodes have a common ancestor
                siblingCheck(ap[i], bp[i]) :

                // Otherwise nodes in our document sort first
                ap[i] === _root ? -1 :
                bp[i] === _root ? 1 :
                0;
        },

        // General-purpose constants
        strundefined = typeof undefined,
        MAX_NEGATIVE = 1 << 31,

        // Instance methods
        hasOwn = (
        {}).hasOwnProperty,
        arr = [],
        pop = arr.pop,
        push_native = arr.push,
        push = arr.push,
        slice = arr.slice,
        // Use a stripped-down indexOf if we can't use a native one
        indexOf = arr.indexOf || function(elem)
        {
            var i = 0,
                len = this.length;
            for (; i < len; i++)
            {
                if (this[i] === elem)
                {
                    return i;
                }
            }
            return -1;
        },

        booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

        // Regular expressions

        // Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
        whitespace = "[\\x20\\t\\r\\n\\f]",
        // http://www.w3.org/TR/css3-syntax/#characters
        characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

        // Loosely modeled on CSS identifier characters
        // An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
        // Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
        identifier = characterEncoding.replace("w", "w#"),

        // Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
        attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
        "*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

        // Prefer arguments quoted,
        //   then not containing pseudos/brackets,
        //   then attribute selectors/non-parenthetical expressions,
        //   then anything else
        // These preferences are here to reduce the number of selectors
        //   needing tokenize in the PSEUDO preFilter
        pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace(3, 8) + ")*)|.*)\\)|)",

        // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
        rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),

        rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
        rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"),

        rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g"),

        rpseudo = new RegExp(pseudos),
        ridentifier = new RegExp("^" + identifier + "$"),

        matchExpr = {
            "ID": new RegExp("^#(" + characterEncoding + ")"),
            "CLASS": new RegExp("^\\.(" + characterEncoding + ")"),
            "TAG": new RegExp("^(" + characterEncoding.replace("w", "w*") + ")"),
            "ATTR": new RegExp("^" + attributes),
            "PSEUDO": new RegExp("^" + pseudos),
            "CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
                "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
                "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
            "bool": new RegExp("^(?:" + booleans + ")$", "i"),
            // For use in libraries implementing .is()
            // We use this for POS matching in `select`
            "needsContext": new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
                whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
        },

        rinputs = /^(?:input|select|textarea|button)$/i,
        rheader = /^h\d$/i,

        rnative = /^[^{]+\{\s*\[native \w/,

        // Easily-parseable/retrievable ID or TAG or CLASS selectors
        rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

        rsibling = /[+~]/,
        rescape = /'|\\/g,

        // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
        runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"),
        funescape = function(_, escaped, escapedWhitespace)
        {
            var high = "0x" + escaped - 0x10000;
            // NaN means non-codepoint
            // Support: Firefox<24
            // Workaround erroneous numeric interpretation of +"0x"
            return high !== high || escapedWhitespace ?
                escaped :
                high < 0 ?
                // BMP codepoint
                String.fromCharCode(high + 0x10000) :
                // Supplemental Plane codepoint (surrogate pair)
                String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
        };

    function Sizzle(selector, context, results, seed)
    {
        var match, elem, m;

        if (!context)
        {
            return [];
        }
        if ((context._owner || context) !== _root)
        {
            setRoot(context);
        }

        results = results || [];

        if (!selector || typeof selector !== "string")
        {
            return results;
        }

        if (!seed)
        {

            // Shortcuts
            if ((match = rquickExpr.exec(selector)))
            {
                // Speed-up: Sizzle("#ID")
                if ((m = match[1]))
                {
                    elem = context.getElementById(m);
                    // Check parentNode to catch when Blackberry 4.6 returns
                    // nodes that are no longer in the document (jQuery #6963)
                    if (elem && elem.Parent)
                    {
                        // Handle the case where IE, Opera, and Webkit return items
                        // by name instead of ID
                        if (elem.id === m)
                        {
                            results.push(elem);
                            return results;
                        }
                    }
                    else
                    {
                        return results;
                    }

                    // Speed-up: Sizzle("TAG")
                }
                else if (match[2])
                {
                    push.apply(results, context.getElementsByTagName(selector));
                    return results;

                    // Speed-up: Sizzle(".CLASS")
                }
                else if (m = match[3])
                {
                    push.apply(results, context.getElementsByClassName(m));
                    return results;
                }
            }
        }

        // All others
        return select(selector.replace(rtrim, "$1"), context, results, seed);
    }

    function getNodeDir(node, dir)
        {
            switch (dir)
            {
                case "parent":
                    return node.Parent;
                case "nextSibling":
                    return node._nextSibling;
                default:
                    return node._isFirstChild ? null : node._previousSibling;
            }
        }
        /**
         * Create key-value caches of limited size
         * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
         *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
         *	deleting the oldest entry
         */

    function createCache()
    {
        var keys = [];

        function cache(key, value)
        {
            // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
            if (keys.push(key + " ") > Expr.cacheLength)
            {
                // Only keep the most recent entries
                delete cache[keys.shift()];
            }
            return (cache[key + " "] = value);
        }
        return cache;
    }

    /**
     * Mark a function for special use by Sizzle
     * @param {Function} fn The function to mark
     */
    function markFunction(fn)
    {
        fn[expando] = true;
        return fn;
    }


    /**
     * Adds the same handler for all of the specified attrs
     * @param {String} attrs Pipe-separated list of attributes
     * @param {Function} handler The method that will be applied
     */
    function addHandle(attrs, handler)
    {
        var arr = attrs.split("|"),
            i = attrs.length;

        while (i--)
        {
            Expr.attrHandle[arr[i]] = handler;
        }
    }

    /**
     * Checks document order of two siblings
     * @param {Element} a
     * @param {Element} b
     * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
     */
    function siblingCheck(a, b)
    {
        var cur = b && a;

        // Check if b follows a
        if (cur)
        {
            while ((cur = cur._nextSibling))
            {
                if (cur === b)
                {
                    return -1;
                }
            }
        }

        return a ? 1 : -1;
    }

    /**
     * Returns a function to use in pseudos for positionals
     * @param {Function} fn
     */
    function createPositionalPseudo(fn)
    {
        return markFunction(function(argument)
        {
            argument = +argument;
            return markFunction(function(seed, matches)
            {
                var j,
                    matchIndexes = fn([], seed.length, argument),
                    i = matchIndexes.length;

                // Match elements found at the specified indexes
                while (i--)
                {
                    if (seed[(j = matchIndexes[i])])
                    {
                        seed[j] = !(matches[j] = seed[j]);
                    }
                }
            });
        });
    }

    support = Sizzle.support = {};

    /**
     * Sets document-related variables once based on the current document
     * @param {Element|Object} [doc] An element or document object to use to set the document
     * @returns {Object} Returns the current document
     */
    setRoot = Sizzle.setRoot = function(node)
    {
        var root = node ? node._owner || node : _root;

        // If no document and documentElement is available, return
        if (root === _root)
        {
            return root;
        }

        // Set our document
        _root = root;

        return root;
    };

    Sizzle.matches = function(expr, elements)
    {
        return Sizzle(expr, null, null, elements);
    };

    Sizzle.matchesSelector = function(elem, expr)
    {
        // Set document vars if needed
        if ((elem._owner || elem) !== _root)
        {
            setRoot(elem);
        }

        // Make sure that attribute selectors are quoted
        expr = expr.replace(rattributeQuotes, "='$1']");

        return Sizzle(expr, _root, null, [elem]).length > 0;
    };

    Sizzle.contains = function(context, elem)
    {
        return contains(context, elem);
    };

    Sizzle.attr = function(elem, name)
    {

        var fn = (elem.getGetter ? elem.getGetter(name, true) : null),
            // Don't get fooled by Object.prototype properties (jQuery #13807)
            val = fn ?
            fn.call(elem) : elem[name];

        return val;
    };

    Sizzle.error = function(msg)
    {
        Eco.Logger.error("Syntax error, unrecognized expression: " + msg);
    };

    /**
     * Document sorting and removing duplicates
     * @param {ArrayLike} results
     */
    Sizzle.uniqueSort = function(results)
    {
        var elem,
            duplicates = [],
            j = 0,
            i = 0;

        // Unless we *know* we can detect duplicates, assume their presence
        hasDuplicate = !support.detectDuplicates;
        sortInput = !support.sortStable && results.slice(0);
        results.sort(sortOrder);

        if (hasDuplicate)
        {
            while ((elem = results[i++]))
            {
                if (elem === results[i])
                {
                    j = duplicates.push(i);
                }
            }
            while (j--)
            {
                results.splice(duplicates[j], 1);
            }
        }

        // Clear input after sorting to release objects
        // See https://github.com/jquery/sizzle/pull/225
        sortInput = null;

        return results;
    };

    /**
     * Utility function for retrieving the text value of an array of DOM nodes
     * @param {Array|Element} elem
     */
    getText = Sizzle.getText = function(elem)
    {
        return elem.text;
    };

    Expr = Sizzle.selectors = {

        // Can be adjusted by the user
        cacheLength: 50,

        createPseudo: markFunction,

        match: matchExpr,

        find:
        {
            "ID": function(id, context)
            {
                var m = context.getElementById(id);
                return m && m.Parent ? [m] : [];
            },
            "TAG": function(tag, context)
            {
                return context.getElementsByTagName(tag);
            },
            "CLASS": function(clsName, context)
            {
                return context.getElementsByClassName(clsName);
            }
        },

        relative:
        {
            ">":
            {
                dir: "parent",
                first: true
            },
            " ":
            {
                dir: "parent"
            },
            "+":
            {
                dir: "previousSibling",
                first: true
            },
            "~":
            {
                dir: "previousSibling"
            }
        },

        preFilter:
        {
            "ATTR": function(match)
            {
                match[1] = match[1].replace(runescape, funescape);

                // Move the given value to match[3] whether quoted or unquoted
                match[3] = (match[4] || match[5] || "").replace(runescape, funescape);

                if (match[2] === "~=")
                {
                    match[3] = " " + match[3] + " ";
                }

                return match.slice(0, 4);
            },

            "CHILD": function(match)
            {
                /* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
                match[1] = match[1].toLowerCase();

                if (match[1].slice(0, 3) === "nth")
                {
                    // nth-* requires argument
                    if (!match[3])
                    {
                        Sizzle.error(match[0]);
                    }

                    // numeric x and y parameters for Expr.filter.CHILD
                    // remember that false/true cast respectively to 0/1
                    match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
                    match[5] = +((match[7] + match[8]) || match[3] === "odd");

                    // other types prohibit arguments
                }
                else if (match[3])
                {
                    Sizzle.error(match[0]);
                }

                return match;
            },

            "PSEUDO": function(match)
            {
                var excess,
                    unquoted = !match[5] && match[2];

                if (matchExpr["CHILD"].test(match[0]))
                {
                    return null;
                }

                // Accept quoted arguments as-is
                if (match[3] && match[4] !== undefined)
                {
                    match[2] = match[4];

                    // Strip excess characters from unquoted arguments
                }
                else if (unquoted && rpseudo.test(unquoted) &&
                    // Get excess from tokenize (recursively)
                    (excess = tokenize(unquoted, true)) &&
                    // advance to the next closing parenthesis
                    (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length))
                {

                    // excess is a negative index
                    match[0] = match[0].slice(0, excess);
                    match[2] = unquoted.slice(0, excess);
                }

                // Return only captures needed by the pseudo filter method (type and argument)
                return match.slice(0, 3);
            }
        },

        filter:
        {
            "ID": function(id)
            {
                var attrId = id.replace(runescape, funescape);
                return function(elem)
                {
                    return elem._id == attrId;
                };
            },
            "TAG": function(nodeNameSelector)
            {
                var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
                return nodeNameSelector === "*" ?
                    function()
                    {
                        return true;
                    } :
                    function(elem)
                    {
                        return elem._type && elem._type.toLowerCase() === nodeName;
                    };
            },

            "CLASS": function(className)
            {
                var pattern = classCache[className + " "];

                return pattern ||
                    (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) &&
                    classCache(className, function(elem)
                    {
                        return pattern.test(typeof elem._class === "string" && elem._class || "");
                    });
            },

            "ATTR": function(name, operator, check)
            {
                return function(elem)
                {
                    var result = Sizzle.attr(elem, name);

                    if (result == null)
                    {
                        return operator === "!=";
                    }
                    if (!operator)
                    {
                        return true;
                    }

                    result += "";

                    return operator === "=" ? result === check :
                        operator === "!=" ? result !== check :
                        operator === "^=" ? check && result.indexOf(check) === 0 :
                        operator === "*=" ? check && result.indexOf(check) > -1 :
                        operator === "$=" ? check && result.slice(-check.length) === check :
                        operator === "~=" ? (" " + result + " ").indexOf(check) > -1 :
                        operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" :
                        false;
                };
            },

            "CHILD": function(type, what, argument, first, last)
            {
                var simple = type.slice(0, 3) !== "nth",
                    forward = type.slice(-4) !== "last",
                    ofType = what === "of-type";

                return first === 1 && last === 0 ?

                    // Shortcut for :nth-*(n)
                    function(elem)
                    {
                        return !!elem.Parent;
                    } :

                    function(elem, context)
                    {
                        var cache, outerCache, node, diff, nodeIndex, start,
                            dir = simple !== forward ? "nextSibling" : "previousSibling",
                            parent = elem.Parent,
                            name = ofType && elem._type,
                            useCache = !ofType;

                        if (parent)
                        {

                            // :(first|last|only)-(child|of-type)
                            if (simple)
                            {
                                while (dir)
                                {
                                    node = elem;
                                    while ((node = getNodeDir(node, dir)))
                                    {
                                        if (ofType ? node._type === name : true)
                                        {
                                            return false;
                                        }
                                    }
                                    // Reverse direction for :only-* (if we haven't yet done so)
                                    start = dir = type === "only" && !start && "nextSibling";
                                }
                                return true;
                            }

                            start = [forward ? parent._firstChild : parent.getLastChild()];

                            // non-xml :nth-child(...) stores cache data on `parent`
                            if (forward && useCache)
                            {
                                // Seek `elem` from a previously-cached index
                                outerCache = parent[expando] || (parent[expando] = {});
                                cache = outerCache[type] || [];
                                nodeIndex = cache[0] === dirruns && cache[1];
                                diff = cache[0] === dirruns && cache[2];
                                node = nodeIndex && parent.getChildByIndex(nodeIndex);

                                while ((node = ++nodeIndex && node && getNodeDir(node, dir) ||

                                    // Fallback to seeking `elem` from the start
                                    (diff = nodeIndex = 0) || start.pop()))
                                {

                                    // When found, cache indexes on `parent` and break
                                    if (++diff && node === elem)
                                    {
                                        outerCache[type] = [dirruns, nodeIndex, diff];
                                        break;
                                    }
                                }

                                // Use previously-cached element index if available
                            }
                            else if (useCache && (cache = (elem[expando] || (elem[expando] = {}))[type]) && cache[0] === dirruns)
                            {
                                diff = cache[1];

                                // xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
                            }
                            else
                            {
                                // Use the same loop as above to seek `elem` from the start
                                while ((node = ++nodeIndex && node && getNodeDir(node, dir) ||
                                    (diff = nodeIndex = 0) || start.pop()))
                                {

                                    if ((ofType ? node._type === name : true) && ++diff)
                                    {
                                        // Cache the index of each encountered element
                                        if (useCache)
                                        {
                                            (node[expando] || (node[expando] = {}))[type] = [dirruns, diff];
                                        }

                                        if (node === elem)
                                        {
                                            break;
                                        }
                                    }
                                }
                            }

                            // Incorporate the offset, then check against cycle size
                            diff -= last;
                            return diff === first || (diff % first === 0 && diff / first >= 0);
                        }
                    };
            },

            "PSEUDO": function(pseudo, argument)
            {
                // pseudo-class names are case-insensitive
                // http://www.w3.org/TR/selectors/#pseudo-classes
                // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
                // Remember that setFilters inherits from pseudos
                var args,
                    fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] ||
                    Sizzle.error("unsupported pseudo: " + pseudo);

                // The user may use createPseudo to indicate that
                // arguments are needed to create the filter function
                // just as Sizzle does
                if (fn[expando])
                {
                    return fn(argument);
                }

                // But maintain support for old signatures
                if (fn.length > 1)
                {
                    args = [pseudo, pseudo, "", argument];
                    return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ?
                        markFunction(function(seed, matches)
                        {
                            var idx,
                                matched = fn(seed, argument),
                                i = matched.length;
                            while (i--)
                            {
                                idx = indexOf.call(seed, matched[i]);
                                seed[idx] = !(matches[idx] = matched[i]);
                            }
                        }) :
                        function(elem)
                        {
                            return fn(elem, 0, args);
                        };
                }

                return fn;
            }
        },

        pseudos:
        {
            // Potentially complex pseudos
            "not": markFunction(function(selector)
            {
                // Trim the selector passed to compile
                // to avoid treating leading and trailing
                // spaces as combinators
                var input = [],
                    results = [],
                    matcher = compile(selector.replace(rtrim, "$1"));

                return matcher[expando] ?
                    markFunction(function(seed, matches, context)
                    {
                        var elem,
                            unmatched = matcher(seed, null, []),
                            i = seed.length;

                        // Match elements unmatched by `matcher`
                        while (i--)
                        {
                            if ((elem = unmatched[i]))
                            {
                                seed[i] = !(matches[i] = elem);
                            }
                        }
                    }) :
                    function(elem, context)
                    {
                        input[0] = elem;
                        matcher(input, null, results);
                        return !results.pop();
                    };
            }),

            "has": markFunction(function(selector)
            {
                return function(elem)
                {
                    return Sizzle(selector, elem).length > 0;
                };
            }),

            "contains": markFunction(function(text)
            {
                return function(elem)
                {
                    return (getText(elem)).indexOf(text) > -1;
                };
            }),

            // "Whether an element is represented by a :lang() selector
            // is based solely on the element's language value
            // being equal to the identifier C,
            // or beginning with the identifier C immediately followed by "-".
            // The matching of C against the element's language value is performed case-insensitively.
            // The identifier C does not have to be a valid language name."
            // http://www.w3.org/TR/selectors/#lang-pseudo
            "lang": markFunction(function(lang)
            {
                // lang value must be a valid identifier
                if (!ridentifier.test(lang || ""))
                {
                    Sizzle.error("unsupported lang: " + lang);
                }
                lang = lang.replace(runescape, funescape).toLowerCase();
                return function(elem)
                {
                    var elemLang;
                    do {
                        if (elemLang = elem.lang)
                        {
                            elemLang = elemLang.toLowerCase();
                            return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
                        }
                    } while (elem = elem.Parent);
                    return false;
                };
            }),

            // Miscellaneous
            "root": function(elem)
            {
                return elem === _root;
            },

            "focus": function(elem)
            {
                return elem === _root._focusElem;
            },

            // Boolean properties
            "enabled": function(elem)
            {
                return elem.disabled === false;
            },

            "disabled": function(elem)
            {
                return elem.disabled === true;
            },
            /*
            		"checked": function( elem ) {
            			// In CSS3, :checked should return both checked and selected elements
            			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
            			var nodeName = elem.nodeName.toLowerCase();
            			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
            		},

            		"selected": function( elem ) {
            			// Accessing this property makes selected-by-default
            			// options in Safari work properly
            			if ( elem.parentNode ) {
            				elem.parentNode.selectedIndex;
            			}

            			return elem.selected === true;
            		},
            */
            // Contents
            "empty": function(elem)
            {
                return !elem.hasChildren();
            },

            "parent": function(elem)
            {
                return !Expr.pseudos["empty"](elem);
            },
            /*
            		"input": function( elem ) {
            			return rinputs.test( elem.nodeName );
            		},

            		"button": function( elem ) {
            			var name = elem.nodeName.toLowerCase();
            			return name === "input" && elem.type === "button" || name === "button";
            		},
            		"text": function( elem ) {
            			var attr;
            			return elem.nodeName.toLowerCase() === "input" &&
            				elem.type === "text" &&

            				// Support: IE<8
            				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
            				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
            		},
            */

            // Position-in-collection
            "first": createPositionalPseudo(function()
            {
                return [0];
            }),

            "last": createPositionalPseudo(function(matchIndexes, length)
            {
                return [length - 1];
            }),

            "eq": createPositionalPseudo(function(matchIndexes, length, argument)
            {
                return [argument < 0 ? argument + length : argument];
            }),

            "even": createPositionalPseudo(function(matchIndexes, length)
            {
                var i = 0;
                for (; i < length; i += 2)
                {
                    matchIndexes.push(i);
                }
                return matchIndexes;
            }),

            "odd": createPositionalPseudo(function(matchIndexes, length)
            {
                var i = 1;
                for (; i < length; i += 2)
                {
                    matchIndexes.push(i);
                }
                return matchIndexes;
            }),

            "lt": createPositionalPseudo(function(matchIndexes, length, argument)
            {
                var i = argument < 0 ? argument + length : argument;
                for (; --i >= 0;)
                {
                    matchIndexes.push(i);
                }
                return matchIndexes;
            }),

            "gt": createPositionalPseudo(function(matchIndexes, length, argument)
            {
                var i = argument < 0 ? argument + length : argument;
                for (; ++i < length;)
                {
                    matchIndexes.push(i);
                }
                return matchIndexes;
            })
        }
    };

    Expr.pseudos["nth"] = Expr.pseudos["eq"];

    // Add button/input type pseudos
    /*
    for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
    	Expr.pseudos[ i ] = createInputPseudo( i );
    }
    for ( i in { submit: true, reset: true } ) {
    	Expr.pseudos[ i ] = createButtonPseudo( i );
    }
    */

    // Easy API for creating new setFilters
    function setFilters()
    {}
    setFilters.prototype = Expr.filters = Expr.pseudos;
    Expr.setFilters = new setFilters();

    function tokenize(selector, parseOnly)
    {
        var matched, match, tokens, type,
            soFar, groups, preFilters,
            cached = tokenCache[selector + " "];

        if (cached)
        {
            return parseOnly ? 0 : cached.slice(0);
        }

        soFar = selector;
        groups = [];
        preFilters = Expr.preFilter;

        while (soFar)
        {

            // Comma and first run
            if (!matched || (match = rcomma.exec(soFar)))
            {
                if (match)
                {
                    // Don't consume trailing commas as valid
                    soFar = soFar.slice(match[0].length) || soFar;
                }
                groups.push((tokens = []));
            }

            matched = false;

            // Combinators
            if ((match = rcombinators.exec(soFar)))
            {
                matched = match.shift();
                tokens.push(
                {
                    value: matched,
                    // Cast descendant combinators to space
                    type: match[0].replace(rtrim, " ")
                });
                soFar = soFar.slice(matched.length);
            }

            // Filters
            for (type in Expr.filter)
            {
                if (matchExpr[type].exec && (match = matchExpr[type].exec(soFar)) && (!preFilters[type] ||
                    (match = preFilters[type](match))))
                {
                    matched = match.shift();
                    tokens.push(
                    {
                        value: matched,
                        type: type,
                        matches: match
                    });
                    soFar = soFar.slice(matched.length);
                }
            }

            if (!matched)
            {
                break;
            }
        }

        // Return the length of the invalid excess
        // if we're just parsing
        // Otherwise, throw an error or return tokens
        return parseOnly ?
            soFar.length :
            soFar ?
            Sizzle.error(selector) :
            // Cache the tokens
            tokenCache(selector, groups).slice(0);
    }

    function toSelector(tokens)
    {
        var i = 0,
            len = tokens.length,
            selector = "";
        for (; i < len; i++)
        {
            selector += tokens[i].value;
        }
        return selector;
    }

    function addCombinator(matcher, combinator, base)
    {
        var dir = combinator.dir,
            doneName = done++;

        return combinator.first ?
            // Check against closest ancestor/preceding element
            function(elem, context)
            {
                while ((elem = getNodeDir(elem, dir)))
                {
                    return matcher(elem, context);
                }
            } :

            // Check against all ancestor/preceding elements
            function(elem, context)
            {
                var oldCache, outerCache,
                    newCache = [dirruns, doneName];

                // We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
                while ((elem = getNodeDir(elem, dir)))
                {
                    outerCache = elem[expando] || (elem[expando] = {});
                    if ((oldCache = outerCache[dir]) &&
                        oldCache[0] === dirruns && oldCache[1] === doneName)
                    {

                        // Assign to newCache so results back-propagate to previous elements
                        return (newCache[2] = oldCache[2]);
                    }
                    else
                    {
                        // Reuse newcache so results back-propagate to previous elements
                        outerCache[dir] = newCache;

                        // A match means we're done; a fail means we have to keep checking
                        if ((newCache[2] = matcher(elem, context)))
                        {
                            return true;
                        }
                    }
                }
            };
    }

    function elementMatcher(matchers)
    {
        return matchers.length > 1 ?
            function(elem, context)
            {
                var i = matchers.length;
                while (i--)
                {
                    if (!matchers[i](elem, context))
                    {
                        return false;
                    }
                }
                return true;
            } :
            matchers[0];
    }

    function multipleContexts(selector, contexts, results)
    {
        var i = 0,
            len = contexts.length;
        for (; i < len; i++)
        {
            Sizzle(selector, contexts[i], results);
        }
        return results;
    }

    function condense(unmatched, map, filter, context)
    {
        var elem,
            newUnmatched = [],
            i = 0,
            len = unmatched.length,
            mapped = map != null;

        for (; i < len; i++)
        {
            if ((elem = unmatched[i]))
            {
                if (!filter || filter(elem, context))
                {
                    newUnmatched.push(elem);
                    if (mapped)
                    {
                        map.push(i);
                    }
                }
            }
        }

        return newUnmatched;
    }

    function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector)
    {
        if (postFilter && !postFilter[expando])
        {
            postFilter = setMatcher(postFilter);
        }
        if (postFinder && !postFinder[expando])
        {
            postFinder = setMatcher(postFinder, postSelector);
        }
        return markFunction(function(seed, results, context)
        {
            var temp, i, elem,
                preMap = [],
                postMap = [],
                preexisting = results.length,

                // Get initial elements from seed or context
                elems = seed || multipleContexts(selector || "*", context._type ? [context] : context, []),

                // Prefilter to get matcher input, preserving a map for seed-results synchronization
                matcherIn = preFilter && (seed || !selector) ?
                condense(elems, preMap, preFilter, context) :
                elems,

                matcherOut = matcher ?
                // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
                (postFinder || (seed ? preFilter : preexisting || postFilter) ?

                    // ...intermediate processing is necessary
                    [] :

                    // ...otherwise use results directly
                    results) :
                matcherIn;

            // Find primary matches
            if (matcher)
            {
                matcher(matcherIn, matcherOut, context);
            }

            // Apply postFilter
            if (postFilter)
            {
                temp = condense(matcherOut, postMap);
                postFilter(temp, [], context);

                // Un-match failing elements by moving them back to matcherIn
                i = temp.length;
                while (i--)
                {
                    if ((elem = temp[i]))
                    {
                        matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
                    }
                }
            }

            if (seed)
            {
                if (postFinder || preFilter)
                {
                    if (postFinder)
                    {
                        // Get the final matcherOut by condensing this intermediate into postFinder contexts
                        temp = [];
                        i = matcherOut.length;
                        while (i--)
                        {
                            if ((elem = matcherOut[i]))
                            {
                                // Restore matcherIn since elem is not yet a final match
                                temp.push((matcherIn[i] = elem));
                            }
                        }
                        postFinder(null, (matcherOut = []), temp);
                    }

                    // Move matched elements from seed to results to keep them synchronized
                    i = matcherOut.length;
                    while (i--)
                    {
                        if ((elem = matcherOut[i]) &&
                            (temp = postFinder ? indexOf.call(seed, elem) : preMap[i]) > -1)
                        {

                            seed[temp] = !(results[temp] = elem);
                        }
                    }
                }

                // Add elements to results, through postFinder if defined
            }
            else
            {
                matcherOut = condense(
                    matcherOut === results ?
                    matcherOut.splice(preexisting, matcherOut.length) :
                    matcherOut
                );
                if (postFinder)
                {
                    postFinder(null, results, matcherOut);
                }
                else
                {
                    push.apply(results, matcherOut);
                }
            }
        });
    }

    function matcherFromTokens(tokens)
    {
        var checkContext, matcher, j,
            len = tokens.length,
            leadingRelative = Expr.relative[tokens[0].type],
            implicitRelative = leadingRelative || Expr.relative[" "],
            i = leadingRelative ? 1 : 0,

            // The foundational matcher ensures that elements are reachable from top-level context(s)
            matchContext = addCombinator(function(elem)
            {
                return elem === checkContext;
            }, implicitRelative, true),
            matchAnyContext = addCombinator(function(elem)
            {
                return indexOf.call(checkContext, elem) > -1;
            }, implicitRelative, true),
            matchers = [
                function(elem, context)
                {
                    return (!leadingRelative && (context !== outermostContext)) || (
                        (checkContext = context)._type ?
                        matchContext(elem, context) :
                        matchAnyContext(elem, context));
                }
            ];

        for (; i < len; i++)
        {
            if ((matcher = Expr.relative[tokens[i].type]))
            {
                matchers = [addCombinator(elementMatcher(matchers), matcher)];
            }
            else
            {
                matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);

                // Return special upon seeing a positional matcher
                if (matcher[expando])
                {
                    // Find the next relative operator (if any) for proper handling
                    j = ++i;
                    for (; j < len; j++)
                    {
                        if (Expr.relative[tokens[j].type])
                        {
                            break;
                        }
                    }
                    return setMatcher(
                        i > 1 && elementMatcher(matchers),
                        i > 1 && toSelector(
                            // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                            tokens.slice(0, i - 1).concat(
                            {
                                value: tokens[i - 2].type === " " ? "*" : ""
                            })
                        ).replace(rtrim, "$1"),
                        matcher,
                        i < j && matcherFromTokens(tokens.slice(i, j)),
                        j < len && matcherFromTokens((tokens = tokens.slice(j))),
                        j < len && toSelector(tokens)
                    );
                }
                matchers.push(matcher);
            }
        }

        return elementMatcher(matchers);
    }

    function matcherFromGroupMatchers(elementMatchers, setMatchers)
    {
        var bySet = setMatchers.length > 0,
            byElement = elementMatchers.length > 0,
            superMatcher = function(seed, context, results, outermost)
            {
                var elem, j, matcher,
                    matchedCount = 0,
                    i = "0",
                    unmatched = seed && [],
                    setMatched = [],
                    contextBackup = outermostContext,
                    // We must always have either seed elements or outermost context
                    elems = seed || byElement && Expr.find["TAG"]("*", outermost),
                    // Use integer dirruns iff this is the outermost matcher
                    dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
                    len = elems.length;

                if (outermost)
                {
                    outermostContext = context !== _root && context;
                }

                // Add elements passing elementMatchers directly to results
                // Keep `i` a string if there are no elements so `matchedCount` will be "00" below
                // Support: IE<9, Safari
                // Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
                for (; i !== len && (elem = elems[i]) != null; i++)
                {
                    if (byElement && elem)
                    {
                        j = 0;
                        while ((matcher = elementMatchers[j++]))
                        {
                            if (matcher(elem, context))
                            {
                                results.push(elem);
                                break;
                            }
                        }
                        if (outermost)
                        {
                            dirruns = dirrunsUnique;
                        }
                    }

                    // Track unmatched elements for set filters
                    if (bySet)
                    {
                        // They will have gone through all possible matchers
                        if ((elem = !matcher && elem))
                        {
                            matchedCount--;
                        }

                        // Lengthen the array for every element, matched or not
                        if (seed)
                        {
                            unmatched.push(elem);
                        }
                    }
                }

                // Apply set filters to unmatched elements
                matchedCount += i;
                if (bySet && i !== matchedCount)
                {
                    j = 0;
                    while ((matcher = setMatchers[j++]))
                    {
                        matcher(unmatched, setMatched, context);
                    }

                    if (seed)
                    {
                        // Reintegrate element matches to eliminate the need for sorting
                        if (matchedCount > 0)
                        {
                            while (i--)
                            {
                                if (!(unmatched[i] || setMatched[i]))
                                {
                                    setMatched[i] = pop.call(results);
                                }
                            }
                        }

                        // Discard index placeholder values to get only actual matches
                        setMatched = condense(setMatched);
                    }

                    // Add matches to results
                    push.apply(results, setMatched);

                    // Seedless set matches succeeding multiple successful matchers stipulate sorting
                    if (outermost && !seed && setMatched.length > 0 &&
                        (matchedCount + setMatchers.length) > 1)
                    {

                        Sizzle.uniqueSort(results);
                    }
                }

                // Override manipulation of globals by nested matchers
                if (outermost)
                {
                    dirruns = dirrunsUnique;
                    outermostContext = contextBackup;
                }

                return unmatched;
            };

        return bySet ?
            markFunction(superMatcher) :
            superMatcher;
    }

    compile = Sizzle.compile = function(selector, match /* Internal Use Only */ )
    {
        var i,
            setMatchers = [],
            elementMatchers = [],
            cached = compilerCache[selector + " "];

        if (!cached)
        {
            // Generate a function of recursive functions that can be used to check each element
            if (!match)
            {
                match = tokenize(selector);
            }
            i = match.length;
            while (i--)
            {
                cached = matcherFromTokens(match[i]);
                if (cached[expando])
                {
                    setMatchers.push(cached);
                }
                else
                {
                    elementMatchers.push(cached);
                }
            }

            // Cache the compiled function
            cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));

            // Save selector and tokenization
            cached.selector = selector;
        }
        return cached;
    };

    /**
     * A low-level selection function that works with Sizzle's compiled
     *  selector functions
     * @param {String|Function} selector A selector or a pre-compiled
     *  selector function built with Sizzle.compile
     * @param {Element} context
     * @param {Array} [results]
     * @param {Array} [seed] A set of elements to match against
     */
    select = Sizzle.select = function(selector, context, results, seed)
    {
        var i, tokens, token, type, find,
            compiled = typeof selector === "function" && selector,
            match = !seed && tokenize((selector = compiled.selector || selector));

        results = results || [];

        // Try to minimize operations if there is no seed and only one group
        if (match.length === 1)
        {

            // Take a shortcut and set the context if the root selector is an ID
            tokens = match[0] = match[0].slice(0);
            if (tokens.length > 2 && (token = tokens[0]).type === "ID" &&
                context === _root &&
                Expr.relative[tokens[1].type])
            {

                context = (Expr.find["ID"](token.matches[0].replace(runescape, funescape), context) || [])[0];
                if (!context)
                {
                    return results;

                    // Precompiled matchers will still verify ancestry, so step up a level
                }
                else if (compiled)
                {
                    context = context.Parent;
                }

                selector = selector.slice(tokens.shift().value.length);
            }

            // Fetch a seed set for right-to-left matching
            i = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
            while (i--)
            {
                token = tokens[i];

                // Abort if we hit a combinator
                if (Expr.relative[(type = token.type)])
                {
                    break;
                }
                if ((find = Expr.find[type]))
                {
                    // Search, expanding context for leading sibling combinators
                    if ((seed = find(
                        token.matches[0].replace(runescape, funescape),
                        rsibling.test(tokens[0].type) && context.Parent || context
                    )))
                    {

                        // If seed is empty or no tokens remain, we can return early
                        tokens.splice(i, 1);
                        selector = seed.length && toSelector(tokens);
                        if (!selector)
                        {
                            push.apply(results, seed);
                            return results;
                        }

                        break;
                    }
                }
            }
        }

        // Compile and execute a filtering function if one is not provided
        // Provide `match` to avoid retokenization if we modified the selector above
        (compiled || compile(selector, match))(
            seed,
            context,
            results,
            rsibling.test(selector) && context.Parent || context
        );
        return results;
    };

    // One-time assignments

    // Sort stability
    support.sortStable = expando.split("").sort(sortOrder).join("") === expando;

    // Support: Chrome<14
    // Always assume duplicates if they aren't passed to the comparison function
    support.detectDuplicates = !!hasDuplicate;

    // EXPOSE
    _eco.Sizzle = Sizzle;

})(Eco);