using Dapper;
//using DapperParameters.Attributes;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Web;

namespace ePMS.Frontend.CommonClasses
{
    public class SqlDynamicParameters : SqlMapper.IDynamicParameters
    {
        private readonly DynamicParameters dynamicParameters = new DynamicParameters();

        private readonly List<SqlParameter> sqlParameters = new List<SqlParameter>();

        public void Add(string name, object value = null, DbType? dbType = null, ParameterDirection? direction = null, int? size = null)
        {
            dynamicParameters.Add(name, value, dbType, direction, size);
        }

        public void Add(string name, SqlDbType oracleDbType, int size)//, ParameterDirection direction)
        {
            var oracleParameter = new SqlParameter(name, oracleDbType, size);//,direction);

            sqlParameters.Add(oracleParameter);
        }
        public void Add(string name, SqlDbType oracleDbType)//, ParameterDirection direction)
        {
            var oracleParameter = new SqlParameter(name, oracleDbType);//,direction);

            sqlParameters.Add(oracleParameter);

        }
        public void AddParameters(IDbCommand command, SqlMapper.Identity identity)
        {
            ((SqlMapper.IDynamicParameters)dynamicParameters).AddParameters(command, identity);

            var oracleCommand = command as SqlCommand;

            if (oracleCommand != null)
            {
                oracleCommand.Parameters.AddRange(sqlParameters.ToArray());
            }
        }
       

        private T GetAttribute<T>(MemberInfo propInfo)
        {
            if (propInfo.GetCustomAttributes().FirstOrDefault(a => a is T) is T attribute)
            {
                return attribute;
            }

            return default;
        }

       
        //public IEnumerable<SqlParameter> GetSqlParameters<TClass>(TClass smsystemParam, string condition)
        public SqlDynamicParameters GetSqlParameters<TClass>(TClass smsystemParam)
        {
            SqlDynamicParameters sqlDynamicParameters = new SqlDynamicParameters();
            List<SqlParameter> parameters = new List<SqlParameter>();
            //if (!string.IsNullOrWhiteSpace(condition))
            //{
            //    parameters.Add(
            //                        new SqlParameter("@Condition", System.Data.SqlDbType.VarChar)
            //                        { Value = condition });
            //}

            foreach (var item in smsystemParam.GetType().GetProperties())
            {
                //Exclude ControllerName and ActionName from SQL Parameters generation
                if (item.Name.Equals("ControllerName") || item.Name.Equals("ActionName"))
                {
                    continue;
                }

                if (item.PropertyType == typeof(Nullable<Int32>) || item.PropertyType == typeof(Int32))
                {
                    parameters.Add(new SqlParameter("@" + item.Name + "", System.Data.SqlDbType.Int) { Value = (object)item.GetValue(smsystemParam) ?? DBNull.Value });
                    sqlDynamicParameters.Add(item.Name, value: (object)item.GetValue(smsystemParam) ?? DBNull.Value, DbType.Int32);
                }
                else if (item.PropertyType == typeof(Nullable<Int16>) || item.PropertyType == typeof(Int16))
                {
                    parameters.Add(new SqlParameter("@" + item.Name + "", System.Data.SqlDbType.SmallInt) { Value = (object)item.GetValue(smsystemParam) ?? DBNull.Value });
                    sqlDynamicParameters.Add(item.Name, value: (object)item.GetValue(smsystemParam) ?? DBNull.Value, DbType.Int16);
                }
                else if (item.PropertyType == typeof(Nullable<Int64>) || item.PropertyType == typeof(Int64))
                {
                    parameters.Add(new SqlParameter("@" + item.Name + "", System.Data.SqlDbType.BigInt) { Value = (object)item.GetValue(smsystemParam) ?? DBNull.Value });
                    sqlDynamicParameters.Add(item.Name, value: (object)item.GetValue(smsystemParam) ?? DBNull.Value, DbType.Int64);
                }
                else if (item.PropertyType == typeof(string))
                {
                    parameters.Add(new SqlParameter("@" + item.Name + "", System.Data.SqlDbType.NVarChar) { Value = (object)item.GetValue(smsystemParam) ?? DBNull.Value });
                    sqlDynamicParameters.Add(item.Name, value: (object)item.GetValue(smsystemParam) ?? DBNull.Value, DbType.String);
                }
                else if (item.PropertyType == typeof(Nullable<decimal>) || item.PropertyType == typeof(decimal))
                {
                    parameters.Add(new SqlParameter("@" + item.Name + "", System.Data.SqlDbType.Decimal) { Value = (object)item.GetValue(smsystemParam) ?? DBNull.Value });
                    sqlDynamicParameters.Add(item.Name, value: (object)item.GetValue(smsystemParam) ?? DBNull.Value, DbType.Decimal);
                }
                else if (item.PropertyType == typeof(Nullable<bool>) || item.PropertyType == typeof(bool))
                {
                    parameters.Add(new SqlParameter("@" + item.Name + "", System.Data.SqlDbType.Bit) { Value = (object)item.GetValue(smsystemParam) ?? DBNull.Value });
                    sqlDynamicParameters.Add(item.Name, value: (object)item.GetValue(smsystemParam) ?? DBNull.Value, DbType.Boolean);
                }
                else if (item.PropertyType == typeof(Nullable<DateTime>) || item.PropertyType == typeof(DateTime))
                {
                    parameters.Add(new SqlParameter("@" + item.Name + "", System.Data.SqlDbType.DateTime) { Value = (object)item.GetValue(smsystemParam) ?? DBNull.Value });
                    sqlDynamicParameters.Add(item.Name, value: (object)item.GetValue(smsystemParam) ?? DBNull.Value, DbType.DateTime);
                }
                else if (item.PropertyType == typeof(Nullable<double>) || item.PropertyType == typeof(double))
                {
                    parameters.Add(new SqlParameter("@" + item.Name + "", System.Data.SqlDbType.Money) { Value = (object)item.GetValue(smsystemParam) ?? DBNull.Value });
                    sqlDynamicParameters.Add(item.Name, value: (object)item.GetValue(smsystemParam) ?? DBNull.Value, DbType.VarNumeric);
                }
                //else if (item.PropertyType.IsArray)
                //{
                //    sqlDynamicParameters.AddTable<IntListType>(item.Name, "", (IEnumerable<IntListType>)item.GetValue(smsystemParam));

                //    //var table = new DataTable();
                //    //// Get Properties in order of declaration and ignore if doesn't have a public setter or marked as ignore
                //    //var properties = GetOrderedProperties<IntListType>().Where(property => !IgnoreProperty(property)).ToList();

                //    //foreach (var prop in properties)
                //    //{
                //    //    table.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
                //    //}

                //    //foreach (var value in values)
                //    //{
                //    //    table.Rows.Add(properties.Select(property => property.GetValue(value)).ToArray());
                //    //}
                //    //var oracleParameter = new SqlParameter(parameterName, table.AsTableValuedParameter(dataTableType));//,direction);

                //    ////sqlParameters.Add(oracleParameter);
                //    //// source.Add(parameterName, table.AsTableValuedParameter(dataTableType));

                //    ////dynamicParameters.Add(name, value, dbType, direction, size);

                //    //sqlDynamicParameters.Add(parameterName, value: table.AsTableValuedParameter(dataTableType));


                //}
                //If found any other SqldbType  add other else for the specific type and so on ...
            }
            //return parameters;
            return sqlDynamicParameters;
        }
       
    }


    public static class SqlDynamicParametersExtensions
    {              

        private static T GetAttribute<T>(MemberInfo propInfo)
        {
            if (propInfo.GetCustomAttributes().FirstOrDefault(a => a is T) is T attribute)
            {
                return attribute;
            }

            return default;
        }

       
    }

}
