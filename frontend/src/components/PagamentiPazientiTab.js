import React from "react";
import "../css/PagamentiPazienti.css";
import PagamentoPaziente from "./PagamentoPaziente";
import { ArrowLeft, Search } from "lucide-react";



export default function PagamentiPazientiTab() {
    const pagamenti = [
        {
          name: "Mario Rossi",
          totalAmount: 200,
          activitiesCount: 2,
          amountToPay: 60,
        },
        {
            name: "Mario Rossi",
            totalAmount: 200,
            activitiesCount: 2,
            amountToPay: 60,
        },
        {
            name: "Mario Rossi",
            totalAmount: 200,
            activitiesCount: 2,
            amountToPay: 60,
        },
        {
            name: "Mario Rossi",
            totalAmount: 200,
            activitiesCount: 2,
            amountToPay: 60,
          },
          {
            name: "Mario Rossi",
            totalAmount: 200,
            activitiesCount: 2,
            amountToPay: 60,
          },
          
      ];
    
    return (
             <div className="container">
               <div className="header">
                 <h1>Pagamenti per paziente</h1>
                 <p>Qui troverai la lista dei pagamenti per ogni paziente</p>
               </div>
               <div className="search-container">
                 <Search className="search-icon" />
                 <input type="text" placeholder="Cerca paziente..." className="search-input" />
               </div>

      <div className="pagamenti-list">
        {pagamenti.map((pagamento, index) => (
          <PagamentoPaziente
            key={index}
            name = {pagamento.name}
            totalAmount={pagamento.totalAmount}
            activitiesCount={pagamento.activitiesCount}
            amountToPay={pagamento.amountToPay}
          />
        ))}
      </div>
    </div>
    );
  }
