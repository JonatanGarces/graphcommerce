"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphcommerce7to7_1 = void 0;
const management_sdk_1 = require("@hygraph/management-sdk");
const migrationAction_1 = require("../migrationAction");
const graphcommerce7to7_1 = async (schema) => {
    if (!migrationAction_1.client) {
        return 0;
    }
    const hasRow = schema.models
        .find((m) => m.apiId === 'DynamicRow')
        ?.fields.some((f) => f.apiId === 'row');
    if (hasRow) {
        (0, migrationAction_1.migrationAction)(schema, 'unionField', 'update', {
            apiId: 'row',
            displayName: 'Row Deprecated',
            parentApiId: 'DynamicRow',
            description: 'This field is deprecated. Use Rows instead.',
        });
    }
    (0, migrationAction_1.migrationAction)(schema, 'unionField', 'create', {
        displayName: 'Rows',
        apiId: 'rows',
        isList: true,
        reverseField: {
            modelApiIds: ['RowQuote', 'RowLinks', 'RowColumnOne'],
            apiId: 'dynamicRows',
            displayName: 'Dynamic Rows',
            visibility: management_sdk_1.VisibilityTypes.Hidden,
            isList: true,
        },
        parentApiId: 'DynamicRow',
    }, 'DynamicRow', 'model');
    return migrationAction_1.client.run(true);
};
exports.graphcommerce7to7_1 = graphcommerce7to7_1;
