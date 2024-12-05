import { LightningElement, wire } from 'lwc';
import getAccounts from '@salesforce/apex/FetchAccounts.getAccounts';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

const COLUMNS = [
    { label: 'Account Name', fieldName: 'Name'},
    { label: 'Phone', fieldName: 'Phone' },
    { label: 'Type', fieldName: 'Type' },
    { label: 'Annual Revenue', fieldName: 'AnnualRevenue' },
    { label: 'Number of Employees', fieldName: 'NumberOfEmployees' }
];

export default class ExportData extends LightningElement {
    accounts;
    selectedRows =[];
    columns=COLUMNS;
    isLoading=true;
    connectedCallback(){
        getAccounts()
        .then(data =>{
            this.accounts=data;
            this.isLoading=false;
        })
        .catch(error =>{
            this.error = error;
        })

    }

    handleRowSelection(event){
        this.selectedRows=event.detail.selectedRows;
        console.log(this.selectedRows.length);
    }

    exportToCSV(){
        if (this.selectedRows.length === 0) {
            const error=new ShowToastEvent({
                title: 'No rows selected',
                message: 'Please select at least one row to export.',
                variant: 'error'
            });
            this.dispatchEvent(error);
        }
        else{
            alert('Selected '+this.selectedRows.length);
            const csvData = this.convertToCSV(this.selectedRows);
            this.downloadCSV(csvData);
        }
    }

    convertToCSV(data) {
        const header = Object.keys(data[0]).join(',');
        const rows = data.map(row => Object.values(row).join(','));
        return [header, ...rows].join('\n');
    }

    downloadCSV(csvData) {
        // Convert CSV string to a Base64-encoded data URI
        const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvData);
    
        // Create a temporary anchor element to trigger the download
        const link = document.createElement('a');
        link.href = csvContent;
    
        // Specify the file name for the download
        link.download = 'exported_data.csv';
    
        // Trigger the download
        document.body.appendChild(link); // Append the link to the body
        link.click(); // Programmatically click the link
        document.body.removeChild(link); // Remove the link after download
    }
    


    
}