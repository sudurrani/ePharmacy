using Dapper;
using ePMS.Frontend.Models.ViewModels.OutputViewModel.Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Dynamic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace ePMS.Frontend.CommonClasses
{
    public class Repository //: IRepository
    {
        ResponseOutputDto _responseOutputDto;
        private string _connectionString = string.Empty;
        public Repository()
        {
            _responseOutputDto = new ResponseOutputDto();
            _connectionString = "RealEstateConnection";
        }
        public Repository(string connectionString)
        {
            _responseOutputDto = new ResponseOutputDto();
            _connectionString = connectionString;
        }

        public async Task<ResponseOutputDto> Execute<T>(string queryTextOrProcedureName, SqlDynamicParameters dynamicParameters, bool isCommandTypeProcedure = true) where T : class
        {
            using (var conn = new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings[_connectionString].ConnectionString.ToString()))
            {
                //var id = await conn.ExecuteAsync(queryTextOrProcedureName, dynamicParameters, commandType: isCommandTypeProcedure == true ? CommandType.StoredProcedure : CommandType.Text);
                object response = await conn.ExecuteScalarAsync(queryTextOrProcedureName, dynamicParameters, commandType: isCommandTypeProcedure == true ? CommandType.StoredProcedure : CommandType.Text);

                string message = string.Empty;
                if (response != null)
                {
                    var type = response.GetType().Name;
                    if (type == "String")
                    {
                        if (queryTextOrProcedureName.ToString().Contains("Delete"))
                            message = ERPMessages.Delete_Error;
                        else if (queryTextOrProcedureName.ToString().Contains("Save") || queryTextOrProcedureName.ToString().Contains("Create"))
                            message = ERPMessages.Save_Error;
                        else if (queryTextOrProcedureName.ToString().Contains("Update"))
                            message = ERPMessages.Update_Error;

                        _responseOutputDto.InValid(response.ToString(), message);
                    }
                    else
                    {
                        if (queryTextOrProcedureName.ToString().Contains("Delete"))
                            message = ERPMessages.Delete_Sucess;
                        else if (queryTextOrProcedureName.ToString().Contains("Save") || queryTextOrProcedureName.ToString().Contains("Create"))
                            message = ERPMessages.Save_Sucess;
                        else if (queryTextOrProcedureName.ToString().Contains("Update"))
                            message = ERPMessages.Update_Sucess;

                        _responseOutputDto.Success<T>((T)response, message);
                    }
                }
                else
                {

                    if (queryTextOrProcedureName.ToString().Contains("Delete"))
                        message = ERPMessages.Delete_Sucess;
                    else if (queryTextOrProcedureName.ToString().Contains("Save") || queryTextOrProcedureName.ToString().Contains("Create"))
                        message = ERPMessages.Save_Sucess;
                    else if (queryTextOrProcedureName.ToString().Contains("Update"))
                        message = ERPMessages.Update_Sucess;

                    _responseOutputDto.Success<T>((T)response, message);
                }
            }

            return _responseOutputDto;
        }
        public ResponseOutputDto ExecuteSync<T>(string queryTextOrProcedureName, SqlDynamicParameters dynamicParameters, bool isCommandTypeProcedure = true) where T : class
        {
            using (var conn = new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings[_connectionString].ConnectionString.ToString()))
            {
                conn.Execute(queryTextOrProcedureName, dynamicParameters, commandType: isCommandTypeProcedure == true ? CommandType.StoredProcedure : CommandType.Text);
                string message = string.Empty;
                if (queryTextOrProcedureName.ToString().Contains("Delete"))
                    message = ERPMessages.Delete_Sucess;
                else if (queryTextOrProcedureName.ToString().Contains("Save") || queryTextOrProcedureName.ToString().Contains("Create"))
                    message = ERPMessages.Save_Sucess;
                else if (queryTextOrProcedureName.ToString().Contains("Update"))
                    message = ERPMessages.Update_Sucess;

                _responseOutputDto.Success<T>(null, message);
                _responseOutputDto.Success<T>(null);
            }

            return _responseOutputDto;
        }
        public async Task<ResponseOutputDto> GetMultipleAsync<T>(string queryTextOrProcedureName, SqlDynamicParameters dynamicParameters, bool isCommandTypeProcedure = true) where T : class
        {
            IEnumerable<T> results = null;

            using (var conn = new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings[_connectionString].ConnectionString.ToString()))
            {
                results = await conn.QueryAsync<T>(queryTextOrProcedureName, dynamicParameters, commandType: isCommandTypeProcedure == true ? CommandType.StoredProcedure : CommandType.Text);

                _responseOutputDto.Success<IEnumerable<T>>(results);
            }
            return _responseOutputDto;
        }
        public async Task<ResponseOutputDto> GetSingleAsync<T>(string queryTextOrProcedureName, SqlDynamicParameters dynamicParameters, bool isCommandTypeProcedure = true) where T : class
        {
            using (var conn = new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings[_connectionString].ConnectionString.ToString()))
            {
                var result = await conn.QueryFirstOrDefaultAsync<T>(queryTextOrProcedureName, dynamicParameters, commandType: isCommandTypeProcedure == true ? CommandType.StoredProcedure : CommandType.Text);
                //_responseOutputDto.Success<T>((result == null ? (Activator.CreateInstance<T>()): result));
                _responseOutputDto.Success<T>((result));
            }
            return _responseOutputDto;
        }
        public async Task<ResponseOutputDto> GetMultipleEntitiesAsync<T>(string queryTextOrProcedureName, SqlDynamicParameters dynamicParameters, bool isCommandTypeProcedure = true) where T : class
        {
            using (var conn = new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings[_connectionString].ConnectionString.ToString()))
            {
                using (var dataSet = await conn.QueryMultipleAsync(queryTextOrProcedureName, dynamicParameters, commandType: isCommandTypeProcedure == true ? CommandType.StoredProcedure : CommandType.Text))
                {
                    Type temp = typeof(T);
                    T inputViewModelInstance = Activator.CreateInstance<T>();
                    dynamic expandoObject = new ExpandoObject();

                    foreach (PropertyInfo propertyInfo in temp.GetProperties())
                    {
                        var propType = propertyInfo.PropertyType;
                        var isPropTypeList = propType.IsGenericType;
                        //object instance = Activator.CreateInstance(propertyInfo.PropertyType);
                        if (isPropTypeList)
                        {
                            Type itemTypeList = propType.GetGenericArguments()[0];
                            var propertyTypeDataList = dataSet.Read(itemTypeList).ToList();

                            var listType = typeof(List<>);
                            var constructedListType = listType.MakeGenericType(itemTypeList);
                            var propertyTypeListObject = Activator.CreateInstance(constructedListType) as System.Collections.IList;
                            foreach (var row in propertyTypeDataList)
                            {
                                propertyTypeListObject.Add(row);
                            }
                            inputViewModelInstance.GetType()
                                .GetProperty(propertyInfo.Name)
                                .SetValue(inputViewModelInstance, propertyTypeListObject, null);


                        }
                        else
                        {
                            var propertyTypeData = dataSet.Read(propType).ToList();

                            var listType = typeof(List<>);
                            var constructedListType = listType.MakeGenericType(propType);
                            //var type = Type.GetType(propType.FullName);
                            //if (type != null)
                            //{

                            //}
                            //var instanceIs = Activator.CreateInstance(type);
                            var propertyTypeObject = Activator.CreateInstance(constructedListType) as System.Collections.IList;
                            foreach (var row in propertyTypeData)
                            {
                                propertyTypeObject.Add(row);
                            }
                            var propertyTypeObj = propertyTypeObject.Count > 0 ? propertyTypeObject[0] : Activator.CreateInstance(propType); // instanceIs;
                            inputViewModelInstance.GetType()
                                .GetProperty(propertyInfo.Name)
                                .SetValue(inputViewModelInstance, propertyTypeObj, null);

                        }

                    }


                    _responseOutputDto.Success<object>(inputViewModelInstance);

                }
            }
            return _responseOutputDto;
        }
    }
}