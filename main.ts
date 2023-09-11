import { App, Plugin, PluginSettingTab, Setting } from "obsidian";

import { ViewUpdate, PluginValue, ViewPlugin } from "@codemirror/view";

import { debounce, collectSizeArbitraryValues } from "./helpers";

interface ImageResizerSettings {
	supportArbitaryWidth: boolean;
}

const DEFAULT_SETTINGS: ImageResizerSettings = {
	supportArbitaryWidth: false,
};

export default class MyPlugin extends Plugin {
	settings: ImageResizerSettings;

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
	body.image-resizer{--line-width:40rem;--max-width:88%;--content-margin:auto;--content-margin-start:max();--content-line-width:min()}body.image-resizer .markdown-preview-view .markdown-preview-sizer.markdown-preview-sizer{max-width:100%;margin-inline:auto;width:100%}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-content,body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-sizer{max-width:100%;width:100%}body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div,body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div,body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-sizer>.inline-title,body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-sizer>.embedded-backlinks,body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-sizer>.metadata-container{max-width:var(--max-width);width:var(--line-width);margin-inline:var(--content-margin) !important}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>*:not(div){max-width:var(--content-line-width);margin-inline-start:var(--content-margin-start) !important}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content,body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer{--image-resizer-containar-width:100%;--image-resizer-max-width:100%;--image-resizer-position:center;--image-resizer-border-radius:0}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>.image-embed,body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>.image-embed,body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div:has(.image-embed),body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div:has(.image-embed){text-align:var(--image-resizer-position, 'center')}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>.image-embed img,body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>.image-embed img,body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div:has(.image-embed) img,body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div:has(.image-embed) img{max-width:var(--image-resizer-max-width, '100%');border-radius:var(--image-resizer-border-radius, '0px')}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div[alt~="full"],body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div[alt~="full"]{width:100%;max-width:100%;--image-resizer-max-width:100%}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div[alt~="wide"],body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div[alt~="wide"]{width:88%;max-width:88%;--image-resizer-max-width:100%}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div[alt~="fit"],body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div[alt~="fit"]{--image-resizer-max-width:80%}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div[alt~="half"],body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div[alt~="half"]{--image-resizer-max-width:50%}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div[alt~="1/2"],body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div[alt~="1/2"]{--image-resizer-max-width:50%}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div[alt~="2/3"],body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div[alt~="2/3"]{--image-resizer-max-width:width: 66.66666666666667%}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div[alt~="3/5"],body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div[alt~="3/5"]{--image-resizer-max-width:60%}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div[alt~="4/5"],body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div[alt~="4/5"]{--image-resizer-max-width:80%}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div[alt~="5/6"],body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div[alt~="5/6"]{--image-resizer-max-width:83.33333333%}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div[alt~="center"],body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div[alt~="center"]{--image-resizer-position:center}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div[alt~="left"],body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div[alt~="left"]{--image-resizer-position:left}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div[alt~="right"],body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div[alt~="right"]{--image-resizer-position:right}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div[alt~="rounded"],body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div[alt~="rounded"]{--image-resizer-border-radius:10px}body.image-resizer .markdown-source-view.mod-cm6.is-readable-line-width .cm-contentContainer.cm-contentContainer>.cm-content>div[alt~="rounded-full"],body.image-resizer .markdown-preview-view.is-readable-line-width .markdown-preview-sizer>div[alt~="rounded-full"]{--image-resizer-border-radius:9999px}body:not(.zoom-off) .view-content .image-embed:not(.canvas-node-content):active{width:var(--image-resizer-containar-width, '100%') !important;max-width:var(--image-resizer-containar-width, '100%') !important}body:not(.zoom-off) .view-content .image-embed:not(.canvas-node-content):active img{aspect-ratio:unset;top:50%;z-index:99;transform:translateY(-50%);padding:0;margin:0 auto;width:calc(100% - 20px) !important;max-width:calc(100% - 20px) !important;max-height:95vh;object-fit:contain;left:0;right:0;bottom:0;position:absolute;opacity:1;border-radius:0px !important}
		`;
	}

	async onload() {
		await this.loadSettings();

		this.addStyle();
		this.updateStyle();

		this.addSettingTab(new ImageResizerSetting(this.app, this));
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

	triggerAribitaryValueUpdate() {
		const isSupportArbitaryWidth = this.settings.supportArbitaryWidth;

		// FIXME: How to disable the plugin?
		isSupportArbitaryWidth &&
			this.registerEditorExtension([ArbitaryValuePlugin]);
	}
}

const appendedArbitaryValues: string[] = [];

class ArbitaryValuePluginSource implements PluginValue {
	update(update: ViewUpdate) {
		const {
			state: { doc },
		} = update;

		// @ts-ignore
		const { text } = doc ?? {};

		if (!text?.length) {
			return;
		}

		debounce(() => {
			const arbitaryValues = collectSizeArbitraryValues(text);

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

export const ArbitaryValuePlugin = ViewPlugin.fromClass(
	ArbitaryValuePluginSource
);

class ImageResizerSetting extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h3", { text: "Image Resizer Settings" });

		const mainDesc = containerEl.createEl("p");

		mainDesc.appendText("For help, ");
		mainDesc.appendChild(
			createEl("a", {
				text: "see documentation",
				href: "https://github.com/maoxiaoke/image-resizer",
			})
		);
		mainDesc.appendText(" or join ");
		mainDesc.appendChild(
			createEl("strong", {
				text: "#minimal",
			})
		);
		mainDesc.appendText(" in the ");
		mainDesc.appendChild(
			createEl("a", {
				text: "Obsidian Image Resizer Discord Channel",
				href: "https://discord.gg/gFZYfTQD",
			})
		);
		mainDesc.appendText(" community.");

		new Setting(containerEl)
			.setName("Support arbitary width")
			.setDesc("Whether width value like w-xx is supported")
			.addToggle((toggle) =>
				toggle
					?.setValue(this.plugin.settings.supportArbitaryWidth)
					.onChange(async (value) => {
						this.plugin.settings.supportArbitaryWidth = value;
						this.plugin.saveData(this.plugin.settings);
						this.plugin.triggerAribitaryValueUpdate;
					})
			);
	}
}
