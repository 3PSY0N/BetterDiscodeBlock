/**
 * @name BetterDiscodeBlock
 * @invite undefined
 * @authorLink undefined
 * @donate undefined
 * @patreon undefined
 * @website https://github.com/3PSY0N/BetterDiscodeBlock/tree/main
 * @source https://github.com/3PSY0N/BetterDiscodeBlock/tree/main/BetterDiscodeBlock.plugin.js
 */
/// <reference path="./global.d.ts" />
// @ts-check
/*@cc_on
@if (@_jscript)

	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec("explorer " + pathPlugins);
		shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
	}
	WScript.Quit();

@else@*/

const https = require("https");
const path = require("path");
module.exports = (() => {
    const config = {
        "main": "index.js",
        "info": {
            "name": "BetterDiscodeBlock",
            "authors": [
                {
                    "name": "3PSY0N",
                    "discord_id": "310232764630958084",
                    "github_username": "3PSY0N"
                }
            ],
            "version": "1.0.0",
            "description": "Enhances the discord codeblocks with custom theme",
            "github": "https://github.com/3PSY0N/BetterDiscodeBlock/tree/main",
            "github_raw": "https://github.com/3PSY0N/BetterDiscodeBlock/tree/main/BetterDiscodeBlock.plugin.js"
        },
        "changelog": [
            {
                "title": "Fixes",
                "type": "fixed",
                "items": [
                    "Fixed Copy button",
                    "Fixed crashes when importing an incorrect JSON format in the URL settings of custom themes."
                ]
            }
        ]
    };

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {
            BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Library) => {

            const https = require('https')
            const path = require('path');

            const { Patcher, WebpackModules, DiscordModules, PluginUtilities, Settings } = Library;
            const { SettingGroup, Textbox } = Settings
            const { React } = DiscordModules

            const { Messages } = WebpackModules.getByProps('Messages')
            const PLUGIN_ID = 'BetterDiscodeBlock'

            const defaults = {
                hljs: {
                    languageIconColor:null,
                    hljs_background:null,
                    hljs_foreground:null,
                    hljs_addition:null,
                    hljs_attribute:null,
                    hljs_attr:null,
                    hljs_built_in:null,
                    hljs_bullet:null,
                    hljs_class_keyword:null,
                    hljs_class_title:null,
                    hljs_code:null,
                    hljs_comment:null,
                    hljs_deletion:null,
                    hljs_doctag:null,
                    hljs_emphasis:null,
                    hljs_formula:null,
                    hljs_keyword:null,
                    hljs_lineNumber:null,
                    hljs_link:null,
                    hljs_literal:null,
                    hljs_meta:null,
                    hljs_meta_string:null,
                    hljs_number:null,
                    hljs_operator:null,
                    hljs_punctuation:null,
                    hljs_quote:null,
                    hljs_regexp:null,
                    hljs_section:null,
                    hljs_selector_attr:null,
                    hljs_selector_class:null,
                    hljs_selector_id:null,
                    hljs_selector_pseudo:null,
                    hljs_selector_tag:null,
                    hljs_string:null,
                    hljs_strong:null,
                    hljs_subst:null,
                    hljs_symbol:null,
                    hljs_tag:null,
                    hljs_tag_attr:null,
                    hljs_tag_name:null,
                    hljs_template_tag:null,
                    hljs_template_variable:null,
                    hljs_title:null,
                    hljs_type:null,
                    hljs_variable:null,
                    hljs_function_title:null,
                    hljs_function_keyword:null,
                },
                theme: ''
            }

            let settings = PluginUtilities.loadSettings(PLUGIN_ID, defaults)

            return class BetterDiscodeBlock extends Plugin {
                onStart() {
                    const parser = WebpackModules.getByProps('parse', 'parseTopic')

                    this.unpatch = Patcher.after(parser.defaultRules.codeBlock, 'react', (_, nodes, output) => {
                        this.inject(nodes, output)

                        //nodes[0].content = this.dedent(nodes[0].content)

                        return output
                    });

                    PluginUtilities.addStyle(PLUGIN_ID, this.css)
                }

                onStop() {
                    PluginUtilities.removeStyle(PLUGIN_ID)
                    this.unpatch()
                }

                getSettingsPanel() {
                    const panel = document.createElement("form");
                    panel.classList.add("form");
                    panel.style.setProperty("width", "100%");

                    new SettingGroup('Customization').appendTo(panel).append(
                        new SettingGroup('Main').append(
                            ...this.createColorInput([
                                ['Foreground', 'Applies to any text without a style'],
                                ['Background', 'Applies to the background of the codeblock'],
                                ['Line Numbers', 'Applies to the line numbers']
                            ])
                        ),

                        new SettingGroup('General').append(
                            ...this.createColorInput([
                                ['Keywords', 'Applies to keywords in a regular ALGOL-style language'],
                                ['Built-Ins', 'Applies to built-in objects and/or library objects'],
                                ['Types', 'Applies to syntactically significant types'],
                                ['Literals', 'Applies to special identifiers for built-in values'],
                                ['Numbers', 'Applies to numbers, including units and modifiers (Not widely supported)'],
                                ['Operators', 'Applies to logical and mathematical operators'],
                                ['Punctuation', 'Applies to auxillary punctuation (Not widely supported)'],
                                ['Regular Expressions', 'Applies to literal regular expressions'],
                                ['Strings', 'Applies to literal strings/characters'],
                                ['String Interpolation', 'Applies to parsed sections inside a literal string'],
                                ['Symbols', 'Applies to symbolic constants and interned strings'],
                                ['Classes', 'Applies to class-level declarations'],
                                ['Functions', 'Applies to function or method declarations'],
                                ['Variables', 'Applies to variables declarations'],
                                ['Titles', 'Applies to other declarations'],
                                ['Parameters', 'Applies to function arguments at the place of declaration'],
                                ['Comments', 'Applies to line and block comments'],
                                ['Documentation Tags', 'Applies to documentation markup within comments']
                            ])
                        ),

                        new SettingGroup('Meta').append(
                            ...this.createColorInput([
                                ['Meta', 'Applies to modifiers, annotations, preprocessor directives, etc.'],
                                ['Meta Keywords', 'Applies to keywords or built-ins within meta constructs'],
                                ['Meta Strings', 'Applies to strings within meta constructs']
                            ]),
                        ),

                        new SettingGroup('Markdown').append(
                            ...this.createColorInput([
                                ['Bullet Points', 'Applies to bullet points in an unordered list'],
                                ['Codeblocks', 'Applies to code blocks'],
                                ['Italics', 'Applies to italicized text'],
                                ['Bold', 'Applies to bold text'],
                                ['Hyperlinks', 'Applies to hyperlinks'],
                                ['Quotes', 'Applies to quotations or blockquotes'],
                                ['Headings', 'Applies to headings']
                            ])
                        ),

                        new SettingGroup('CSS').append(
                            ...this.createColorInput([
                                ['Tag Selectors', 'Applies to tag selectors'],
                                ['ID Selectors', 'Applies to ID selectors'],
                                ['Class Selectors', 'Applies to class selectors'],
                                ['Attribute Selectors', 'Applies to attribute selectors'],
                                ['Pseudo Selectors', 'Applies to pseudo selectors']
                            ])
                        ),

                        new SettingGroup('Misc').append(
                            ...this.createColorInput([
                                ['Sections', 'Applies to headings of a section in a config file'],
                                ['Tags', 'Applies to XML and HTML tags'],
                                ['Names', 'Applies to XML and HTML tag names and S-expressions'],
                                ['Unspecified Attributes', 'Applies to names of an attribute with no language defined semantics and sub-attribute within another highlighted object'],
                                ['Attributes', 'Applies to names of an attribute followed by a structured value'],
                                ['Additions', 'Applies to diff additions'],
                                ['Deletions', 'Applies to diff deletions']
                            ])
                        )
                    )

                    new SettingGroup('Themes').appendTo(panel).append(
                        new Textbox(
                            'Custom Theme',
                            'Paste a link to a raw JSON file.',
                            settings.theme,
                            this.readURL.bind(this)
                        )
                    )

                    const div = document.createElement('div')
                    div.innerHTML = '<a target="_blank" href="https://github.com/3PSY0N/BetterDiscodeBlock">Contribute</a>'

                    panel.appendChild(div)

                    return panel
                }

                createColorInput(data) {
                    const pickers = []

                    for (const [title, description] of data) {
                        let key = title.split(/ |-/);
                        key = key[0].toLowerCase() + (key[1] || '');

                        const defaultValue = defaults.hljs[key] || defaults.hljs.foreground
                        const value = settings.hljs[key]

                        console.log(defaultValue, value)

                        pickers.push(new Textbox(
                            title,
                            `${description}. Default: ${defaultValue}`,
                            value && Object.keys(value).length ? value : defaultValue,
                            (color) => this.updateColor(key, color)
                        ))
                    }

                    return pickers
                }

                updateColor(key, color) {
                    settings.hljs[key] = color
                    this.save()
                }

                readURL(value) {
                    if (!value) {
                        settings = defaults
                        return this.save()
                    };

                    if (typeof value === 'string') {
                        if (!/json|(s[ca]|le|c)ss$/.test(value)) return;

                        https.get(value, this.parseResponse.bind(this, value))
                    }
                }

                parseResponse(url, response) {
                    response.setEncoding('utf8').on('data', (chunk) => {
                        try {
                            switch (path.extname(url)) {
                                case '.json': {
                                    const valid = Object.fromEntries(
                                        Object.entries(JSON.parse(chunk)).filter(([key]) => key in defaults.hljs)
                                    )

                                    settings = {
                                        ...settings,
                                        hljs: valid,
                                        theme: url
                                    }

                                    break;
                                }
                            }
                        } catch(e) {
                            console.error(`An error occured: ${e}`);

                            BdApi.showToast(`An error occured: ${e}`, {
                                type: 'danger'
                            })
                        }

                        this.save()
                    })
                }

                save() {
                    PluginUtilities.saveSettings(PLUGIN_ID, settings)
                    this.reload()
                }

                reload() {
                    PluginUtilities.removeStyle(PLUGIN_ID)
                    PluginUtilities.addStyle(PLUGIN_ID, this.css)
                }


                dedent(content) {
                    content = content.replace(/\t/g, ' '.repeat(2));

                    const min = content.match(/^[^\S\n]+/gm)?.reduce((x, y) => Math.min(x, y.length), Infinity) ?? 0;

                    return !min ? content : content.replace(new RegExp(`^ {${min}}`, "gm"), '');
                }

                inject(nodes, output) {
                    const render = output.props.render;

                    output.props.render = (properties) => {
                        const codeblock = render(properties);
                        const { props } = codeblock.props.children;

                        const classes = props.className.split(' ');
                        const language = nodes ? nodes[0].lang : classes[classes.indexOf('hljs') + 1];

                        const innerHTML = props.dangerouslySetInnerHTML
                        let lines;

                        if (innerHTML) {
                            lines = innerHTML.__html.replace(/<span class="(hljs-[a-z]+)">([^<]*)<\/span>/g, (_, className, code) => code
                                .split('\n')
                                .map((line) => `<span class='${className}'>${line}</span>`)
                                .join('\n')
                            ).split('\n')
                        } else {
                            lines = props.children.split('\n')
                        }

                        const dangeorus = Boolean(props.dangerouslySetInnerHTML);
                        delete props.dangerouslySetInnerHTML;

                        props.children = this.render(language, lines, dangeorus);

                        return codeblock;
                    };
                }


                /**
                 * @param {Language|null} language
                 * @param {Array<number, string>} lines
                 * @param {boolean} dangerous
                 */
                render(language, lines, dangerous) {
                    const $hljs = DiscordModules.hljs

                    if ($hljs && typeof $hljs.getLanguage === 'function') {
                        language = $hljs.getLanguage(language);
                    }

                    const icons = {
                        html: {
                            svg: React.createElement('span', {className: 'svg-icon', dangerouslySetInnerHTML: {__html: '<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="m9.032 2 10.005 112.093 44.896 12.401 45.02-12.387L118.968 2H9.032zm89.126 26.539-.627 7.172L97.255 39H44.59l1.257 14h50.156l-.336 3.471-3.233 36.119-.238 2.27L64 102.609v.002l-.034.018-28.177-7.423L33.876 74h13.815l.979 10.919L63.957 89H64v-.546l15.355-3.875L80.959 67H33.261l-3.383-38.117L29.549 25h68.939l-.33 3.539z"/></svg>'}}),
                        },
                        css: {
                            svg: React.createElement('span', {className: 'svg-icon', dangerouslySetInnerHTML: {__html: '<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="m8.76 1 10.055 112.883 45.118 12.58 45.244-12.626L119.24 1H8.76zm89.591 25.862-3.347 37.605.01.203-.014.467v-.004l-2.378 26.294-.262 2.336L64 101.607v.001l-.022.019-28.311-7.888L33.75 72h13.883l.985 11.054 15.386 4.17-.004.008v-.002l15.443-4.229L81.075 65H48.792l-.277-3.043-.631-7.129L47.553 51h34.749l1.264-14H30.64l-.277-3.041-.63-7.131L29.401 23h69.281l-.331 3.862z"/></svg>'}}),
                        },
                        javascript: {
                            svg: React.createElement('span', {className: 'svg-icon', dangerouslySetInnerHTML: {__html: '<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M2 1v125h125V1H2zm66.119 106.513c-1.845 3.749-5.367 6.212-9.448 7.401-6.271 1.44-12.269.619-16.731-2.059-2.986-1.832-5.318-4.652-6.901-7.901l9.52-5.83c.083.035.333.487.667 1.071 1.214 2.034 2.261 3.474 4.319 4.485 2.022.69 6.461 1.131 8.175-2.427 1.047-1.81.714-7.628.714-14.065C58.433 78.073 58.48 68 58.48 58h11.709c0 11 .06 21.418 0 32.152.025 6.58.596 12.446-2.07 17.361zm48.574-3.308c-4.07 13.922-26.762 14.374-35.83 5.176-1.916-2.165-3.117-3.296-4.26-5.795 4.819-2.772 4.819-2.772 9.508-5.485 2.547 3.915 4.902 6.068 9.139 6.949 5.748.702 11.531-1.273 10.234-7.378-1.333-4.986-11.77-6.199-18.873-11.531-7.211-4.843-8.901-16.611-2.975-23.335 1.975-2.487 5.343-4.343 8.877-5.235l3.688-.477c7.081-.143 11.507 1.727 14.756 5.355.904.916 1.642 1.904 3.022 4.045-3.772 2.404-3.76 2.381-9.163 5.879-1.154-2.486-3.069-4.046-5.093-4.724-3.142-.952-7.104.083-7.926 3.403-.285 1.023-.226 1.975.227 3.665 1.273 2.903 5.545 4.165 9.377 5.926 11.031 4.474 14.756 9.271 15.672 14.981.882 4.916-.213 8.105-.38 8.581z"/></svg>'}}),
                        },
                        typescript: {
                            svg: React.createElement('span', {className: 'svg-icon', dangerouslySetInnerHTML: {__html: '<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M2 63.91v62.5h125v-125H2zm100.73-5a15.56 15.56 0 0 1 7.82 4.5 20.58 20.58 0 0 1 3 4c0 .16-5.4 3.81-8.69 5.85-.12.08-.6-.44-1.13-1.23a7.09 7.09 0 0 0-5.87-3.53c-3.79-.26-6.23 1.73-6.21 5a4.58 4.58 0 0 0 .54 2.34c.83 1.73 2.38 2.76 7.24 4.86 8.95 3.85 12.78 6.39 15.16 10 2.66 4 3.25 10.46 1.45 15.24-2 5.2-6.9 8.73-13.83 9.9a38.32 38.32 0 0 1-9.52-.1A23 23 0 0 1 80 109.19c-1.15-1.27-3.39-4.58-3.25-4.82a9.34 9.34 0 0 1 1.15-.73l4.6-2.64 3.59-2.08.75 1.11a16.78 16.78 0 0 0 4.74 4.54c4 2.1 9.46 1.81 12.16-.62a5.43 5.43 0 0 0 .69-6.92c-1-1.39-3-2.56-8.59-5-6.45-2.78-9.23-4.5-11.77-7.24a16.48 16.48 0 0 1-3.43-6.25 25 25 0 0 1-.22-8c1.33-6.23 6-10.58 12.82-11.87a31.66 31.66 0 0 1 9.49.26zm-29.34 5.24v5.12H57.16v46.23H45.65V69.26H29.38v-5a49.19 49.19 0 0 1 .14-5.16c.06-.08 10-.12 22-.1h21.81z"/></svg>'}}),
                        },
                        php: {
                            svg: React.createElement('span', {className: 'svg-icon', dangerouslySetInnerHTML: {__html: '<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><path fill="currentColor"  d="M10.129 45.459h18.983c5.572.047 9.61 1.645 12.112 4.793 2.503 3.148 3.33 7.448 2.48 12.899-.331 2.49-1.063 4.934-2.197 7.33-1.086 2.397-2.597 4.558-4.533 6.485-2.36 2.443-4.887 3.994-7.579 4.652a35.076 35.076 0 0 1-8.358.987h-8.5L9.846 95.996H0l10.129-50.538Zm8.287 8.035-4.25 21.146c.284.047.567.07.85.07h.992c4.533.047 8.31-.4 11.333-1.339 3.022-.987 5.053-4.417 6.092-10.29.85-4.935 0-7.778-2.55-8.53-2.503-.751-5.643-1.104-9.421-1.057-.567.047-1.11.07-1.63.07h-1.487l.071-.07ZM54.922 32h9.774l-2.762 13.463h8.783c4.817.094 8.405 1.08 10.766 2.96 2.409 1.88 3.117 5.45 2.125 10.714l-4.745 23.471h-9.917l4.533-22.414c.472-2.35.33-4.018-.425-5.004-.755-.987-2.384-1.48-4.887-1.48l-7.862-.071-5.809 28.97h-9.774L54.922 32ZM94.106 45.459h18.983c5.572.047 9.61 1.645 12.113 4.793 2.502 3.148 3.329 7.448 2.479 12.899-.331 2.49-1.063 4.934-2.196 7.33-1.086 2.397-2.597 4.558-4.533 6.485-2.361 2.443-4.888 3.994-7.579 4.652a35.08 35.08 0 0 1-8.358.987h-8.5l-2.692 13.392h-9.845l10.129-50.538Zm8.288 8.035-4.25 21.146c.283.047.566.07.85.07h.992c4.533.047 8.31-.4 11.333-1.339 3.022-.987 5.052-4.417 6.091-10.29.85-4.935 0-7.778-2.55-8.53-2.503-.751-5.643-1.104-9.42-1.057-.567.047-1.11.07-1.63.07h-1.487l.071-.07Z"/></svg>'}}),
                        },
                    }

                    /** @var {string} - languageIcon */
                    let languageIcon = ""

                    let headerDiv = React.createElement('div', { className: 'bd-codeblock-language' }, `Raw - ${lines.length} line(s)`)
                    if (language?.name) {
                        const keys = Object.keys(icons)
                        const findKey = keys.find(key => language.name.toLowerCase().includes(key.toLowerCase()))
                        const textHeader = React.createElement('p', null, `${language.name} - ${lines.length} line(s)`)
                        if (findKey) {
                            languageIcon = icons[findKey].svg
                            const langName = language.name.split(',')[0]
                            headerDiv = React.createElement('div', { className: 'bd-codeblock-language' }, languageIcon, textHeader)
                        } else {
                            headerDiv = React.createElement('div', { className: 'bd-codeblock-language' }, textHeader)
                        }
                    }

                    return React.createElement(React.Fragment, null, headerDiv,
                        React.createElement('table', { className: 'bd-codeblock-table' },
                            ...lines.map((line, i) => React.createElement('tr', null,
                                React.createElement('td', null, i + 1),
                                React.createElement('td',
                                    language && dangerous ? {
                                        dangerouslySetInnerHTML: {
                                            __html: line
                                        }
                                    } : {
                                        children: line
                                    }
                                )
                            ))
                        ),

                        React.createElement('button', {
                            className: 'bd-codeblock-copy-btn',
                            onClick: this.clickHandler
                        }, "Copy")
                    )
                }

                clickHandler({ target }) {
                    const { clipboard } = require('electron')

                    if (target.classList.contains('copied')) return

                    target.innerText = 'Copied'//Messages.ACCOUNT_USERNAME_COPY_SUCCESS_1;
                    target.classList.add('copied');

                    setTimeout(() => {
                        target.innerText = 'Copy';
                        target.classList.remove('copied');
                    }, 1e3);

                    const code = [...target.parentElement.querySelectorAll('td:last-child')]
                        .map((cell) => cell.textContent).join('\n');

                    clipboard.writeText(code);
                }


                get css() {
                    return `
				.hljs {
					background-color: ${settings.hljs.hljs_background} !important;
					color: ${settings.hljs.hljs_foreground};
					position: relative;
				}

				.hljs:not([class$='hljs']) {
					padding-top: 2px;
				}

				.bd-codeblock-language {
				    display: flex;
                    align-items: center;
					color: var(--text-normal);
					border-bottom: 1px solid var(--background-modifier-accent);
					padding: 5px;
					margin-bottom: 6px;
					font-size: .8em;
					font-family: 'Raleway', sans-serif;
					font-weight: bold;
				}
				
                .bd-codeblock-language svg {
				    height: 20px;
				    margin-right: 8px;
				    color: ${settings.hljs.languageIconColor};
				}
				
				.bd-codeblock-language .svg-icon {
				    display: flex;
				}
				
				.bd-codeblock-language p {
				    margin: 0;
				    padding: 5px;
				}

				.bd-codeblock-table {
					border-collapse: collapse;
				}

				.bd-codeblock-table tr {
					height: 19px;
					width: 100%;
				}

				.bd-codeblock-table td:first-child {
					border-right: 1px solid var(--background-modifier-accent);
					padding-left: 5px;
					padding-right: 8px;
					user-select: none;
					color: ${settings.hljs.hljs_lineNumber}
				}

				.bd-codeblock-table td:last-child {
					padding-left: 8px;
					word-break: break-all;
				}

				.bd-codeblock-copy-btn {
					color: var(--text-normal);
					border-radius: 4px;
					line-height: 20px;
					padding: 2px 5px;
					font-family: 'Raleway', sans-serif;
					font-size: .8rem;
					font-weight: bold;
					margin: 5px;
					background: var(--background-floating);
					position: absolute;
					right: 0 !important;
					bottom: 0 !important;
					opacity: 0;
					transition: .3s;
				}

				.bd-codeblock-copy-btn.copied {
					color: var(--background-floating);
					background-color: #43b581;
					opacity: 1;
				}

				.hljs:hover .bd-codeblock-copy-btn {
					opacity: 1;
				}
				
                .hljs-emphasis {
                    font-style: italic
                }
                    
                .hljs-strong {
                    font-weight: 700
                }

				${this.codeBlockStyle}				

				.codeLine-14BKbG > span > span {
					color: ${settings.hljs.hljs_foreground};
				}

				${this.textBoxStyle}
			`
                }

                get codeBlockStyle() {
                    return `
                .hljs {
                  background: ${settings.hljs.hljs_background} !important;
                  color: ${settings.hljs.hljs_foreground} !important!;
                }

                .hljs-comment { color: ${settings.hljs.hljs_comment}; }
                .hljs-punctuation { color: ${settings.hljs.hljs_punctuation}; }
                .hljs-tag { color: ${settings.hljs.hljs_tag}; }
                .hljs-tag .hljs-attr { color: ${settings.hljs.hljs_tag_attr}; }
                .hljs-tag .hljs-name { color: ${settings.hljs.hljs_tag_name}; }
                .hljs-attribute { color: ${settings.hljs.hljs_attribute}; }
                .hljs-doctag { color: ${settings.hljs.hljs_doctag}; }
                .hljs-formula { color: ${settings.hljs.hljs_formula}; }
                .hljs-keyword { color: ${settings.hljs.hljs_keyword}; }
                .hljs-deletion { color: ${settings.hljs.hljs_deletion}; }
                .hljs-number { color: ${settings.hljs.hljs_number}; }
                .hljs-quote { color: ${settings.hljs.hljs_quote}; }
                .hljs-selector-class { color: ${settings.hljs.hljs_selector_class}; }
                .hljs-selector-id { color: ${settings.hljs.hljs_selector_id}; }
                .hljs-selector-tag { color: ${settings.hljs.hljs_selector_tag}; }
                .hljs-selector-attr { color: ${settings.hljs.hljs_selector_attr}; }
                .hljs-selector-pseudo { color: ${settings.hljs.hljs_selector_pseudo}; }
                .hljs-subst { color: ${settings.hljs.hljs_subst}; }
                .hljs-string { color: ${settings.hljs.hljs_string}; }
                .hljs-template-tag { color: ${settings.hljs.hljs_template_tag}; }
                .hljs-type { color: ${settings.hljs.hljs_type}; }
                .hljs-section { color: ${settings.hljs.hljs_section}; }
                .hljs-title { color: ${settings.hljs.hljs_title}; }
                .hljs-class .hljs-title { color: ${settings.hljs.hljs_class_title}; }
                .hljs-class .hljs-keyword { color: ${settings.hljs.hljs_class_keyword}; }
                .hljs-link { color: ${settings.hljs.hljs_link}; }
                .hljs-operator { color: ${settings.hljs.hljs_operator}; }
                .hljs-regexp { color: ${settings.hljs.hljs_regexp}; }
                .hljs-symbol { color: ${settings.hljs.hljs_symbol}; }
                .hljs-template-variable { color: ${settings.hljs.hljs_template_variable}; }
                .hljs-variable { color: ${settings.hljs.hljs_variable}; }
                .hljs-literal { color: ${settings.hljs.hljs_literal}; }
                .hljs-addition { color: ${settings.hljs.hljs_addition}; }
                .hljs-built_in { color: ${settings.hljs.hljs_built_in}; }
                .hljs-bullet { color: ${settings.hljs.hljs_bullet}; }
                .hljs-code { color: ${settings.hljs.hljs_code}; }
                .hljs-meta { color: ${settings.hljs.hljs_meta}; }
                .hljs-meta .hljs-string { color: ${settings.hljs.hljs_meta_string}; }
                .hljs-emphasis { color: ${settings.hljs.hljs_emphasis}; }
                .hljs-strong { color: ${settings.hljs.hljs_strong}; }
                .hljs-function .hljs-title { color: ${settings.hljs.hljs_function_title}; }
                .hljs-function .hljs-keyword { color: ${settings.hljs.hljs_function_keyword}; }
			`
                }

                get textBoxStyle() {
                    return this.codeBlockStyle.replace(/\.hljs[\w\. ->]+td/gm, '.codeLine-14BKbG > span > span')
                }
            };
        };
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
