import {
  updateDraggingHtml,
  html,
  createOrderHtml,
  moveToColumn,
} from "./view.js";
import { updateDragging, createOrderData, COLUMNS } from "./data.js";

/**
 * A handler that fires when a user drags over any element inside a column. In
 * order to determine which column the user is dragging over the entire event
 * bubble path is checked with `event.path` (or `event.composedPath()` for
 * browsers that don't support `event.path`). The bubbling path is looped over
 * until an element with a `data-area` attribute is found. Once found both the
 * active dragging column is set in the `state` object in "data.js" and the HTML
 * is updated to reflect the new column.
 *
 * @param {Event} event
 */
const handleDragOver = (event) => {
  event.preventDefault();
  const path = event.path || event.composedPath();
  let column = null;

  for (const element of path) {
    const { area } = element.dataset;
    if (area) {
      column = area;
      break;
    }
  }

  if (!column) return;
  updateDragging({ over: column });
  updateDraggingHtml({ over: column });
};

const handleDragStart = (event) => {};
const handleDragEnd = (event) => {};

const handleHelpToggle = (event) => {
  const element = html.help.overlay;

  element.style.display =
    element.style.display === "none" || element.style.display === ""
      ? "block"
      : "none";
};

const handleAddToggle = (event) => {
  html.other.add.focus();
  const element = html.add.overlay;

  element.style.display =
    element.style.display === "none" || element.style.display === ""
      ? "block"
      : "none";
};

const handleAddSubmit = (event) => {
  event.preventDefault();
  const mainElement = html.other.grid;
  const gridColumnDiv = mainElement.querySelector(".grid__column");
  const orderDiv = gridColumnDiv.getAttribute("data-area");

  const { form } = html.add;

  let title = form.querySelector('[name="title"]').value;
  let table = form.querySelector('[name="table"]').value;
  let column = orderDiv;

  const orderData = createOrderData({ title, table, column });
  const orderHtml = createOrderHtml(orderData);

  const parentContainer = gridColumnDiv;

  const newContainer = document.createElement("div");
  newContainer.className = "grid__content";
  newContainer.setAttribute("data-column", "ordered");

  parentContainer.appendChild(newContainer);

  newContainer.appendChild(orderHtml);
  form.reset();

  const overlay = html.add.overlay;
  overlay.style.display = "none";
};

const handleEditToggle = (event) => {
  const element = html.other.grid;
  const orderElement = element.querySelector(".order");

  const overlay = html.edit.overlay;
  overlay.style.display = "block";

  const titleVal = orderElement.querySelector(".order__title").innerHTML;
  const tableVal = orderElement.querySelector("[data-order-table]").innerHTML;
  const idVal = orderElement.getAttribute("data-id");
  const columnVal = document
    .querySelector(".grid__content")
    .getAttribute("data-column");

  let overlayTitleElement = html.edit.title;
  overlayTitleElement.value = titleVal;

  let overlayTableElement = html.edit.table;
  overlayTableElement.value = tableVal;

  let overlayIDElement = html.edit.id;
  overlayIDElement.value = idVal;

  let overlayColumnElement = html.edit.column;
  overlayColumnElement.value = columnVal;

  const cancelButton = html.edit.cancel;
  cancelButton.addEventListener("click", () => {
    overlay.style.display = "none";
  });
};

const handleEditSubmit = (event) => {
  event.preventDefault();
  const { form } = html.edit;
  const { grid } = html.other;
  const orderElement = grid.querySelector(".order");

  orderElement.querySelector(".order__title").innerHTML =
    form.querySelector("[data-edit-title]").value;
  orderElement.querySelector("[data-order-table]").innerHTML =
    form.querySelector("[data-edit-table]").value;
  orderElement.setAttribute(
    "data-id",
    form.querySelector("[data-edit-id]").value
  );
  document
    .querySelector(".grid__content")
    .setAttribute(
      "data-column",
      form.querySelector("[data-edit-column]").value
    );

  let id = form.querySelector("[data-edit-id]").value;
  let column = form.querySelector("[data-edit-column]").value;

  moveToColumn(id, column);

  const overlay = html.edit.overlay;
  overlay.style.display = "none";
};
const handleDelete = (event) => {
  let id = html.edit.id;
  id = id.value;
  const element = document.querySelector(`[data-id="${id}"]`);

  if (element) {
    element.remove();
  }

  const overlay = html.edit.overlay;
  overlay.style.display = "none";
};

html.add.cancel.addEventListener("click", handleAddToggle);
html.other.add.addEventListener("click", handleAddToggle);
html.add.form.addEventListener("submit", handleAddSubmit);

html.other.grid.addEventListener("click", handleEditToggle);
html.edit.cancel.addEventListener("click", handleEditToggle);
html.edit.form.addEventListener("submit", handleEditSubmit);
html.edit.delete.addEventListener("click", handleDelete);

html.help.cancel.addEventListener("click", handleHelpToggle);
html.other.help.addEventListener("click", handleHelpToggle);

for (const htmlColumn of Object.values(html.columns)) {
  htmlColumn.addEventListener("dragstart", handleDragStart);
  htmlColumn.addEventListener("dragend", handleDragEnd);
}

for (const htmlArea of Object.values(html.area)) {
  htmlArea.addEventListener("dragover", handleDragOver);
}
