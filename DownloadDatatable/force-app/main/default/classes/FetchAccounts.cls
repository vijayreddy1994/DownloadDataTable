public with sharing class FetchAccounts {
    @AuraEnabled
    public static List<Account> getAccounts() {
        List<Account> accList = [
            SELECT
                Id,
                Name,
                Phone,
                Type,
                AnnualRevenue,
                NumberOfEmployees
            FROM Account
            ORDER BY Name
            LIMIT 10
        ];
        return accList;
    }
}