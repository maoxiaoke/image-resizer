import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";

import {
	ViewUpdate,
	PluginValue,
	EditorView,
	ViewPlugin,
} from "@codemirror/view";

import { debounce, collectSizeArbitraryValues } from "./helpers";

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	addStyle() {
		const css = document.createElement("style");
		css.id = "image-resizer";
		document.getElementsByTagName("head")[0].appendChild(css);

		// add the main class
		document.body.classList.add("image-resizer");
	}

	updateStyle() {
		const el = document.getElementById("image-resizer");

		if (!el) {
			throw "image resizer element is not found";
		}

		el.innerHTML = `
	body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content,body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer{--image-resizer-containar-width:100%;--image-resizer-max-width:100%;--image-resizer-position:center;--image-resizer-border-radius:0}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>.image-embed,body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>.image-embed,body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div:has(.image-embed),body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div:has(.image-embed){text-align:var(--image-resizer-position, 'center')}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>.image-embed img,body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>.image-embed img,body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div:has(.image-embed) img,body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div:has(.image-embed) img{max-width:var(--image-resizer-max-width, '100%');border-radius:var(--image-resizer-border-radius, '0px')}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div[alt~="full"],body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div[alt~="full"]{width:100%;max-width:100%;--image-resizer-max-width:100%}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div[alt~="wide"],body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div[alt~="wide"]{width:88%;max-width:88%;--image-resizer-max-width:100%}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div[alt~="fit"],body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div[alt~="fit"]{--image-resizer-max-width:80%}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div[alt~="half"],body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div[alt~="half"]{--image-resizer-max-width:50%}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div[alt~="1/2"],body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div[alt~="1/2"]{--image-resizer-max-width:50%}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div[alt~="2/3"],body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div[alt~="2/3"]{--image-resizer-max-width:width: 66.66666666666667%}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div[alt~="3/5"],body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div[alt~="3/5"]{--image-resizer-max-width:60%}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div[alt~="4/5"],body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div[alt~="4/5"]{--image-resizer-max-width:80%}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div[alt~="5/6"],body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div[alt~="5/6"]{--image-resizer-max-width:83.33333333%}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div[alt~="center"],body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div[alt~="center"]{--image-resizer-position:center}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div[alt~="left"],body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div[alt~="left"]{--image-resizer-position:left}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div[alt~="right"],body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div[alt~="right"]{--image-resizer-position:right}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div[alt~="rounded"],body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div[alt~="rounded"]{--image-resizer-border-radius:10px}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div[alt~="rounded-full"],body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div[alt~="rounded-full"]{--image-resizer-border-radius:9999px}body:not(.zoom-off) .view-content .image-embed:not(.canvas-node-content):active{width:var(--image-resizer-containar-width, '100%') !important;max-width:var(--image-resizer-containar-width, '100%') !important}body:not(.zoom-off) .view-content .image-embed:not(.canvas-node-content):active img{aspect-ratio:unset;top:50%;z-index:99;transform:translateY(-50%);padding:0;margin:0 auto;width:calc(100% - 20px) !important;max-width:calc(100% - 20px) !important;max-height:95vh;object-fit:contain;left:0;right:0;bottom:0;position:absolute;opacity:1;border-radius:0px !important}
	
		`;
	}

	async onload() {
		// await this.loadSettings();

		this.addStyle();
		this.updateStyle();

		const view = this.app.workspace.getActiveViewOfType(MarkdownView);

		console.log("view", view);

		// Make sure the user is editing a Markdown file.
		// if (view) {
		// 	const cursor = view.editor.getCursor();

		// 	console.log("cursor", cursor);

		// 	// ...
		// }

		this.registerEditorExtension([examplePlugin]);

		// this.registerMarkdownPostProcessor((element, context) => {
		// 	console.log("code------", element);
		// 	const codeblocks = element.querySelectorAll("code");

		// 	for (let index = 0; index < codeblocks.length; index++) {
		// 		const codeblock = codeblocks.item(index);
		// 		const text = codeblock.innerText.trim();
		// 		const isEmoji =
		// 			text[0] === ":" && text[text.length - 1] === ":";

		// 		if (isEmoji) {
		// 			// context.addChild(new Emoji(codeblock, text));
		// 		}
		// 	}
		// });

		// This creates an icon in the left ribbon.
		// const ribbonIconEl = this.addRibbonIcon(
		// 	"dice",
		// 	"Sample Plugin",
		// 	(evt: MouseEvent) => {
		// 		// Called when the user clicks the icon.
		// 		new Notice("This is a notice!");
		// 	}
		// );
		// Perform additional things with the ribbon
		// ribbonIconEl.addClass("my-plugin-ribbon-class");

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText("Status Bar Text");

		// This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: "open-sample-modal-simple",
		// 	name: "Open sample modal (simple)",
		// 	callback: () => {
		// 		new SampleModal(this.app).open();
		// 	},
		// });
		// This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: "sample-editor-command",
		// 	name: "Sample editor command",
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection("Sample Editor Command");
		// 	},
		// });
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: "open-sample-modal-complex",
		// 	name: "Open sample modal (complex)",
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView =
		// 			this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}

		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	},
		// });

		// This adds a settings tab so the user can configure various aspects of the plugin
		// this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, "click", (evt: MouseEvent) => {
		// 	console.log("click", evt);
		// });

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(
		// 	window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		// );
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

const appendedArbitaryValues: string[] = [];

class ExamplePlugin implements PluginValue {
	update(update: ViewUpdate) {
		console.log("udpate", update);
		const {
			state: { doc },
		} = update;

		// @ts-ignore
		const { text } = doc ?? {};

		console.log("text", text);

		if (!text?.length) {
			return;
		}

		debounce(() => {
			console.log("debounce----bbbbb");
			const arbitaryValues = collectSizeArbitraryValues(text);
			console.log("arbitaryValues", arbitaryValues);

			arbitaryValues.forEach((value) => {
				if (!appendedArbitaryValues.includes(value)) {
					this.updateStyle(value);
					appendedArbitaryValues.push(value);
				}
			});
		}, 1000)();
	}

	updateStyle(width: string) {
		const el = document.getElementById("image-resizer");

		if (!el) {
			throw "image resizer element is not found";
		}

		el.innerHTML =
			el.innerHTML +
			`
			body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer > .cm-content > div[alt~="w-${width}"],
			body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer > div[alt~="w-${width}"] {
				width: 100%;
				max-width: 100%;
				--image-resizer-max-width: ${width}px;
			}
		`;
	}
}

export const examplePlugin = ViewPlugin.fromClass(ExamplePlugin);

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText("Woah!");
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		// const { containerEl } = this;
		// containerEl.empty();
		// new Setting(containerEl)
		// 	.setName("Setting #1")
		// 	.setDesc("It's a secret")
		// 	.addText((text) =>
		// 		text
		// 			.setPlaceholder("Enter your secret")
		// 			.setValue(this.plugin.settings.mySetting)
		// 			.onChange(async (value) => {
		// 				this.plugin.settings.mySetting = value;
		// 				await this.plugin.saveSettings();
		// 			})
		// 	);
	}
}
