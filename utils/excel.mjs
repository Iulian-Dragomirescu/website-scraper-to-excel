import ExcelJS from "exceljs";
import { nanoid } from "nanoid";
import fs from "node:fs";
import path from "node:path";
import { dirname } from "./__dirname.mjs";
import { logger } from "./logger.mjs";

const reduceOpacity = (hexColor, opacity) => {
  // Validate input
  if (!/^([0-9A-Fa-f]{3}){1,2}$/.test(hexColor)) {
    console.error("Invalid hex color code");
    return null;
  }

  // Ensure opacity is between 0 and 1
  opacity = Math.max(0, Math.min(1, opacity));

  // Parse hex color
  let hex = hexColor.slice(1);
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  // Convert hex to RGB
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // Calculate the new RGB values with reduced opacity
  const newR = Math.round(r + (255 - r) * (1 - opacity));
  const newG = Math.round(g + (255 - g) * (1 - opacity));
  const newB = Math.round(b + (255 - b) * (1 - opacity));

  // Convert the new RGB values to hex
  const newHex = `${((1 << 24) | (newR << 16) | (newG << 8) | newB)
    .toString(16)
    .slice(1)}`;

  return newHex;
};

const onlyUnique = (value, index, array) => {
  return array.indexOf(value) === index;
};

export const toExcel = async ({ data = [], options }) => {
  // Sort the data alphabetically based on the 'name' column
  const sortByColumn = "name";

  data.sort((a, b) => (a[sortByColumn] > b[sortByColumn] ? 1 : -1));

  // Create a new workbook and add a worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  // Get all keys from the products
  const keys = [];

  data.map((e) => {
    Object.keys(e).map((y) => keys.push(y));
  });

  const headers = keys.filter(onlyUnique);

  // Add headers to the worksheet
  worksheet.addRow(headers);

  // Add data to the worksheet
  data.forEach((item) => {
    const rowValues = headers.map((header) => item[header]);
    worksheet.addRow(rowValues);
  });

  //  Add color to the worksheet
  worksheet.columns.forEach(function (column, i) {
    column["eachCell"]({ includeEmpty: true }, function (cell, rowNumber) {
      const headerName = headers[i];

      options?.fields?.forEach((field) => {
        if (headerName === field.name && field.color) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
              argb: reduceOpacity(field.color, field.opacity || 1),
            },
            bgColor: { argb: "" },
          };

          cell.border = {
            top: { style: "thin", color: { argb: "E0E3E8" } },
            left: { style: "thin", color: { argb: "E0E3E8" } },
            bottom: { style: "thin", color: { argb: "E0E3E8" } },
            right: { style: "thin", color: { argb: "E0E3E8" } },
          };
        }
      });
      // }
    });
  });

  // Auto-fit column widths
  worksheet.columns.forEach(function (column, i) {
    let maxLength = 15;
    column["eachCell"]({ includeEmpty: true }, function (cell) {
      var columnLength = cell.value ? cell.value.toString().length : 10;
      if (columnLength > maxLength) {
        maxLength = columnLength;
      }
    });
    column.width = maxLength < 10 ? 10 : maxLength;
  });

  // Read the file into a buffer
  const fileBuffer = await workbook.xlsx.writeBuffer();

  // Generate a unique filename for the Excel file
  const publicDir = path.join(dirname, "../public/export/");
  const fileName = `${options.fileName}-${new Date().toLocaleDateString(
    "ro-RO"
  )}-${nanoid(6)}.xlsx`;

  fs.writeFile(publicDir + fileName, fileBuffer, (err) => {
    if (err) {
      logger.error("Error writing file:", err);
    } else {
      logger.success(`File successfully saved as: "${fileName}"`);
    }
  });
};
