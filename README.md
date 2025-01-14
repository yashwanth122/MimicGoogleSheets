# **Web Application Mimicking Google Sheets**

## **Overview**
This project is a web-based application designed to replicate the core functionalities and user interface of Google Sheets. The application supports spreadsheet-like operations, including mathematical calculations, data quality functions, and basic formatting. Bonus features include the ability to save/load spreadsheets and visualize data using charts and graphs.

---

## **Features**
### 1. **Spreadsheet Interface**
- **Google Sheets-like UI**: Includes toolbar, formula bar, and structured cells.
- **Drag Functionality**: Enables dragging for content, formulas, and selections.
- **Cell Dependencies**: Ensures automatic updates for related cells upon changes.
- **Formatting Options**: Supports bold, italics, font size adjustments, and color changes.
- **Row/Column Operations**: Add, delete, and resize rows and columns dynamically.

### 2. **Mathematical Functions**
- **SUM**: Calculates the sum of selected cells.
- **AVERAGE**: Computes the average value of selected cells.
- **MAX**: Finds the maximum value in a range.
- **MIN**: Finds the minimum value in a range.
- **COUNT**: Counts numerical entries in a range.

### 3. **Data Quality Functions**
- **TRIM**: Removes leading and trailing whitespaces.
- **UPPER**: Converts text to uppercase.
- **LOWER**: Converts text to lowercase.
- **REMOVE_DUPLICATES**: Eliminates duplicate rows in a selected range.
- **FIND_AND_REPLACE**: Searches and replaces specific text.

### 4. **Data Entry and Validation**
- Supports input for numbers, text, and dates.
- Includes validation to restrict invalid data (e.g., enforcing numerical input for numeric cells).

### 5. **Testing Features**
- Users can input their own data to test functionalities.
- Results are displayed in a clear and interactive manner.

---

## **Bonus Features**
- Advanced formulas and complex cell referencing (relative and absolute references).
- Save and load functionality for spreadsheets.
- Data visualization with charts and graphs.
- Support for additional mathematical and data quality functions.

---

## **Tech Stack**
### **Frontend**
- **React.js**: To create a dynamic and responsive user interface.
- **Bootstrap/Tailwind CSS**: For styling and ensuring the design is visually appealing and responsive.

### **Backend**
- **Node.js**: For server-side logic.
- **Express.js**: To handle API requests and responses.

### **Database**
- **MongoDB**: To store user-created spreadsheets for saving and loading purposes.

### **State Management**
- **Redux**: To manage the application's state and ensure efficient updates.

---

## **Data Structures**
- **Two-Dimensional Array**: Used to represent the spreadsheet grid.
- **Hash Map**: For storing and quickly accessing cell dependencies.
- **Stack**: Utilized for undo/redo functionality.
- **Graph**: To track and resolve dependencies in formulas.

---

## **Setup Instructions**
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/web-sheets.git
   cd web-sheets
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open your browser and navigate to `http://localhost:3000`.

---

## **Testing**
- Unit testing with **Jest**.
- Integration testing with **Cypress** for UI flows.

---

## **Future Enhancements**
- Add collaborative features (real-time editing by multiple users).
- Improve charting capabilities with more advanced visualizations.
- Extend support for importing/exporting files in formats like CSV and XLSX.
