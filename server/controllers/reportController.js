const PDFDocument = require("pdfkit");
const Transaction = require("../models/Transaction");

exports.downloadPortfolioReport =
  async (req, res) => {

    try {

      const transactions =
  await Transaction.find({
    investor: req.user._id
  }).populate("fund");

      const doc =
        new PDFDocument();

      res.setHeader(
        "Content-Type",
        "application/pdf"
      );

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=portfolio-report.pdf"
      );

      doc.pipe(res);

      doc
        .fontSize(20)
        .text(
          "MutualSIP Portfolio Report",
          {
            align: "center"
          }
        );

      doc.moveDown();
      const totalInvested =
      transactions.reduce(
        (sum, txn) =>
          sum + txn.amount,
        0
      );
    
    doc.moveDown();
    
    doc.text(
      `Total Transactions: ${transactions.length}`
    );
    
    doc.text(
      `Total Invested: ₹${totalInvested}`
    );
    
    doc.moveDown();

      doc.moveDown();

      transactions.forEach(
        (txn, index) => {
      
          const assetName =
            txn.assetType === "FUND"
              ? txn.fund?.fundName || "Mutual Fund"
              : txn.symbol;
      
          doc.text(
            `${index + 1}. ${assetName}`
          );
      
          doc.text(
            `Asset Type: ${txn.assetType}`
          );
      
          doc.text(
            `Amount: ₹${txn.amount}`
          );
      
          doc.text(
            `Transaction: ${txn.type}`
          );
      
          doc.text(
            `Date: ${new Date(
              txn.createdAt
            ).toLocaleDateString()
            }`
          );
      
          doc.moveDown();
      
        }
      );

      doc.end();

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to generate report"
      });

    }

};