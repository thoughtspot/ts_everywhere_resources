//
//  ThoughtSpot.swift
//  Embedded TS
//
//  Created by Bryant Howell on 11/7/23.
//

import Foundation

struct MetadataListItem: Codable {
    var identifier: String?
    var name_pattern: String?
    var type: String?
}

struct MetadataSearchSortOptions: Codable{
    var field_name: String
    var order: String
}

struct MetadataSearchRequest: Codable {
    var metadata: [MetadataListItem]
    var record_offset: Int
    var record_size: Int
    var include_visualization_headers: Bool
    var sort_options: MetadataSearchSortOptions?
}

// Representing Liveboard from metadata response
struct Liveboard: Equatable, Comparable {
    var id: String
    var name: String
    
    static func < (lhs: Liveboard, rhs: Liveboard) -> Bool{
        return lhs.name < rhs.name
    }
}

struct ThoughtSpotRestApiV2 {
    var url: String
    var accessToken: String
    
    var apiUrlBase = "/api/rest/2.0/"
    
    func makeThoughtSpotRestRequest(apiEndpoint: String, httpMethod: String, jsonString: String?) -> URLRequest {
        let fullApiUrl = url + apiUrlBase + apiEndpoint
        let url = URL(string: fullApiUrl)!
        var urlRequest = URLRequest(url: url)
        // Set standard HTTP Headers for TS REST API V2
        //urlRequest.setValue("ThoughtSpot", forHTTPHeaderField: "X-Requested-By")
        urlRequest.setValue("application/json", forHTTPHeaderField: "Accept")
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        //urlRequest.setValue("en_US", forHTTPHeaderField: "Accept-Language")
        urlRequest.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        urlRequest.httpMethod = "POST"
        
        if (jsonString != nil){
            urlRequest.httpBody = jsonString!.data(using: .utf8)
        }
        
        return urlRequest
    }
    
    func metadataSearchRequest(searchRequest: MetadataSearchRequest) -> URLRequest{
        let apiEndpoint = "metadata/search"
        let jsonEncoder = JSONEncoder()
        var jsonString = ""
        if let jsonData = try? jsonEncoder.encode(searchRequest),
            let jsonStr = String(data: jsonData, encoding: .utf8){
            jsonString = jsonStr
            print(jsonString)
        }
        
        return makeThoughtSpotRestRequest(apiEndpoint: apiEndpoint, httpMethod: "POST", jsonString: jsonString)

    }
    
    func processLiveboardMetadataSearchResponse(data: Data) throws -> [Liveboard]{
            print(data)
            
            let json = try JSONSerialization.jsonObject(with: data, options: [])
            print(json)
            var lbs: [Liveboard] = []
            if let array = json as? [Any] {
                print("\(array.count) items from API response")
                
                for object in array {
                    // Cast the response as AnyObject
                    let obj = object as AnyObject
                    // print(obj)
                    
                    // Double check that API response included details for LIVEBOARD type
                    let mdType = obj["metadata_type"] as! String
                    if(mdType != "LIVEBOARD"){
                        throw TSApiError.badResponse
                    }
                    
                    // Get the basic properties to construct Liveboard object for listings / loading
                    let lbId = obj["metadata_id"] as! String
                    let lbName = obj["metadata_name"] as! String
                    print("Liveboard \(lbName) with id: \(lbId)")
                    
                    // Additional properties could be added from JSON response to Liveboard model class eventually
                    
                    lbs.append(Liveboard(id: lbId, name: lbName))
                }
            }
        return lbs
    }
    
}



enum TSApiError: Error {
    case badResponse
}
