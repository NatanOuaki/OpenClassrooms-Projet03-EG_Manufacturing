import { LightningElement, api, wire, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getOpportunities from '@salesforce/apex/AccountOpportunitiesController.getOpportunities';

export default class AccountOpportunitiesViewer extends LightningElement {
    @api recordId;
    @track opportunities = []; // Correction ici - Initialiser les opportunités à un tableau vide
    @track error = null; // Correction ici - Initialiser l'erreur à null
    
    wiredResult;       // Ajout ici - stocke le résultat du @wire
    isLoading = false; // Ajout ici - désactiver le bouton / spinner

    
    columns = [
        { label: 'Nom Opportunité', fieldName: 'Name', type: 'text' },
        { label: 'Montant', fieldName: 'Amount', type: 'currency' },
        { label: 'Date de Clôture', fieldName: 'CloseDate', type: 'date' },
        { label: 'Phase', fieldName: 'StageName', type: 'text' }
    ];

    @wire(getOpportunities, { accountId: '$recordId' })  // Correction ici - Inverser accountId et $recordId
    wiredOpportunities(result) {
        this.wiredResult = result; // Ajout ici - stocker le résultat du @wire pour pouvoir le rafraîchir plus tard
        const { data, error } = result; // Ajout ici - extraire data et error du résultat du @wire

        if (data) {
            this.error = null; // Ajout ici - Réinitialiser l'erreur en cas de succès
            this.opportunities = data;
        } else if (error) {
            this.error = error;
            this.opportunities = []; // Ajout ici - Réinitialiser les opportunités en cas d'erreur
        }
    }

    // Ajout ici - Getter pour déterminer si la liste est vide

    get isEmpty() {
        return !this.isLoading && !this.error && (this.opportunities?.length ?? 0) === 0;
    }


    // Ajout ici - Méthode pour rafraîchir les données

    async handleRefresh() { 
        if (!this.wiredResult) return;

        this.isLoading = true;
        try {
            await refreshApex(this.wiredResult); // relance l'appel Apex wire
        } catch (e) {
            this.error = e;
            this.opportunities = [];
        } finally {
            this.isLoading = false;
        }
    }





}
