import { html, LitElement, PropertyDeclarations } from "@polymer/lit-element";
import "@polymer/paper-button/paper-button";
import "@polymer/paper-icon-button/paper-icon-button";
import { fireEvent } from "../../../common/dom/fire_event";
import { showEditCardDialog } from "../editor/show-edit-card-dialog";

import { hassLocalizeLitMixin } from "../../../mixins/lit-localize-mixin";
import { confDeleteCard } from "../editor/delete-card";
import { HomeAssistant } from "../../../types";
import { LovelaceCardConfig } from "../../../data/lovelace";

declare global {
  // for fire event
  interface HASSDomEvents {
    "show-edit-card": {
      cardConfig?: LovelaceCardConfig;
      viewId?: string | number;
      add: boolean;
      reloadLovelace: () => void;
    };
  }
}

export class HuiCardOptions extends hassLocalizeLitMixin(LitElement) {
  public cardConfig?: LovelaceCardConfig;
  protected hass?: HomeAssistant;

  static get properties(): PropertyDeclarations {
    return { hass: {} };
  }

  protected render() {
    return html`
      <style>
        div {
          border-top: 1px solid #e8e8e8;
          padding: 5px 16px;
          background: var(--paper-card-background-color, white);
          box-shadow: rgba(0, 0, 0, 0.14) 0px 2px 2px 0px,
            rgba(0, 0, 0, 0.12) 0px 1px 5px 0px,
            rgba(0, 0, 0, 0.2) 0px 3px 1px -2px;
        }
        paper-button {
          color: var(--primary-color);
          font-weight: 500;
        }
        paper-icon-button.delete {
          color: var(--secondary-text-color);
          float: right;
        }
      </style>
      <slot></slot>
      <div>
        <paper-button @click="${this._editCard}"
          >${
            this.localize("ui.panel.lovelace.editor.edit_card.edit")
          }</paper-button
        >
        <paper-icon-button
          class="delete"
          icon="hass:delete"
          @click="${this._deleteCard}"
          title="${this.localize("ui.panel.lovelace.editor.edit_card.delete")}"
        ></paper-icon-button>
      </div>
    `;
  }
  private _editCard(): void {
    if (!this.cardConfig) {
      return;
    }
    showEditCardDialog(this, {
      cardConfig: this.cardConfig,
      add: false,
      reloadLovelace: () => fireEvent(this, "config-refresh"),
    });
  }
  private _deleteCard(): void {
    if (!this.cardConfig) {
      return;
    }
    if (!this.cardConfig.id) {
      this._editCard();
      return;
    }
    confDeleteCard(this.hass!, this.cardConfig.id, () =>
      fireEvent(this, "config-refresh")
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-card-options": HuiCardOptions;
  }
}

customElements.define("hui-card-options", HuiCardOptions);
