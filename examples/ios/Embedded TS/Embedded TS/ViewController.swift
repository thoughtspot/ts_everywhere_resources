//
//  ViewController.swift
//  Embedded TS
//
//  Created by Bryant Howell on 11/7/23.
//

import UIKit
import Foundation
import WebKit

var appDelegate = (UIApplication.shared.delegate as! AppDelegate)
var TSRestApi = ThoughtSpotRestApiV2(
    url: UsrDefaults.string(forKey: "TSUrl")!,
    accessToken: UsrDefaults.string(forKey: "TSAccessToken")!
)
var liveboards: [Liveboard] = []
var loggedInTS = false

// Shared HTTP session object for request
let urlSession = URLSession.shared

// Share the process across all the WK Views that might exist, for memory and cookies
var wkProcessPool = WKProcessPool()
var wkDataStore = WKWebsiteDataStore.default()
//var wkSharedConfiguration = WKWebViewConfiguration()
//var wkSharedView = WKWebView()


class TokenInputDelegate: UIResponder, UITextFieldDelegate {
    func textFieldShouldReturn(_ textField: UITextField) -> Bool{
        print("Field Should Return")
        
        print("New token value is:")
        print(textField.text!)
        TSAccessToken = textField.text!
        UsrDefaults.set(TSAccessToken, forKey: "TSAccessToken")
        textField.resignFirstResponder()
        return true
    }
}

class UrlInputDelegate: UIResponder, UITextFieldDelegate {
    func textFieldShouldReturn(_ textField: UITextField) -> Bool{
        print("Field Should Return")
        
        print("New url value is:")
        print(textField.text!)
        TSUrl = textField.text!
        UsrDefaults.set(TSUrl, forKey: "TSUrl")
        TSRestApi.accessToken = TSAccessToken!
        textField.resignFirstResponder()
        return true
    }
}

class FirstViewController: UIViewController {
    
    @IBOutlet weak var topLabel: UILabel!
    
    @IBOutlet weak var tokenTextField: UITextField!
    @IBOutlet weak var urlTextField: UITextField!
    
    var tokenInputDelegate = TokenInputDelegate()
    var urlInputDelegate = UrlInputDelegate()
    

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        print("Here the view has loaded")
        topLabel.text = TSUrl
        print("Current token value:")

        TSAccessToken = UsrDefaults.string(forKey: "TSAccessToken")
        TSUrl = UsrDefaults.string(forKey: "TSUrl")
        
        print(TSAccessToken)
        
        // Handle each field with separate logic
        tokenTextField.delegate = tokenInputDelegate
        urlTextField.delegate = urlInputDelegate
        
        
        if (TSUrl != nil){
            urlTextField.text = TSUrl
        }
        
        
        if (TSAccessToken != nil){
            tokenTextField.text = TSAccessToken
        }
        
        // Load the Liveboards once we're up and going
        if (TSUrl != nil && TSAccessToken != nil && liveboards == []){
            loadLiveboards()
        }
        
    }
    
    func loadLiveboards() {
        // Load Liveboards from REST API data from the disk and assign it to the meals property
        // Attempt to make a TS request
        let mdSearchReq = MetadataSearchRequest(
            metadata: [MetadataListItem(type: "LIVEBOARD")],
            record_offset: 0,
            record_size: 100000,
            include_visualization_headers: true
        )
        let liveboardsUrlRequest = TSRestApi.metadataSearchRequest(searchRequest: mdSearchReq)
        print(liveboardsUrlRequest)
        print(liveboardsUrlRequest.allHTTPHeaderFields)
        
        // Create the data task for the session, and update the liveboards object with the processed results
        let task = urlSession.dataTask(with: liveboardsUrlRequest) {
            (data, response, error) in
            
            print(response)
            
            if let error = error {
                print("Http Request error")
                print(error)
                // Better error logging here
            }
            else if let data = data {
                // Handle HTTP request response
                print("Http Request returned successfully")
                print(data)
                
                do {
                    // Reset from any previously retrieved data
                    liveboards = []
                    liveboards = try TSRestApi.processLiveboardMetadataSearchResponse(data: data)
                }
                catch {
                    print("Liveboards could not be retrieved from REST API")
                    // More stuff to warn about it
                }
            }
                
            else {
                // Handle unexpected error
                print("Some other error from HttpRequest, not from the API response itself")
            }
        }
        
        // Resume the task to make it send
        task.resume()
    }
    
    @IBAction func textFieldEditBeings(_ sender: UITextField) {
        print("Editing should be starting here")
    }
    @IBAction func textFieldEditChange(_ sender: UITextField) {
        print("Editing changed be starting here")
        
    }
    
    @IBAction func firstButtonTouchDown(_ sender: UIButton) {
        print("Show button been touched")
        
        
    }
    @IBAction func retrieveButtonTouchDown(_ sender: UIButton) {
        print("Retrieve button been touched")
        // Retrieve the Liveboards and store
        if (TSUrl != nil && TSAccessToken != nil){
            loadLiveboards()
        }
    }
    @IBSegueAction func segueToListingVIew(_ coder: NSCoder) -> LiveboardTableViewController? {
        return LiveboardTableViewController(coder: coder)
        
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // 1
        print("Any segue bout to happen")
        print(segue.identifier)
        guard let identifier = segue.identifier else { return }
        
        // 2
        if identifier == "showLiveboardsButtonSegue" {
            print("Transitioning to LiveboardTableViewController")

        }
    }
    
    // Blocks the segue if the liveboards haven't loaded
    override func shouldPerformSegue(withIdentifier identifier: String, sender: Any?) -> Bool {
        if (liveboards.count == 0){
            return false
        }
        else {
            return true
        }
        
    }
    
    
}

// For listing the Liveboards
class LiveboardTableViewController: UITableViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        
    }
    
    // Required table view methods
    override func tableView(_ tableView: UITableView,
                            numberOfRowsInSection section: Int) -> Int {
        return liveboards.count
    }
    
    // Builds the cells for the tableView
    override func tableView(_ tableView: UITableView,
                            cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let liveboard = liveboards[indexPath.row]
        
        // Creating a cell that we defined in InterfaceBuilder as 'LiveboardCell'
        let cell: UITableViewCell = tableView.dequeueReusableCell(withIdentifier: "LiveboardCell", for: indexPath)
        var content = cell.defaultContentConfiguration()
        
        // Build out the cell of the listing using attributes from the Liveboard models, which come from the REST API call
        
        content.text = liveboard.name
        // You wouldn't really want to show the IDs in a final view, but they are useful while configuring
        content.secondaryText = liveboard.id
        
        cell.contentConfiguration = content
        return cell
    }
    
    // Navigation methods
    
    // Fires on selecting any of the cells
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // 1
        print("Any segue bout to happen")
        print(segue.identifier)
        guard let identifier = segue.identifier else { return }
        
        // 2
        if identifier == "segueToLiveboardComponent" {
            print("Transitioning to LiveboardComponentController")
        }
    }
    
    
    @IBSegueAction func showLiveboardDetailsStart(_ coder: NSCoder) -> LiveboardComponentViewController? {
        print("We about to segue and load that beautiful Liveboard")
        // Initialize LiveboardComponentViewController with selected Liveboard and return

        if let selectedIndexPath = tableView.indexPathForSelectedRow {
            return LiveboardComponentViewController(coder: coder, liveboard: liveboards[selectedIndexPath.row])
        }
        else{
            return nil
        }
    }
    
    
    @IBAction func unwindWithSegue(_ segue: UIStoryboardSegue) {
        // Capture the new or updated meal from the LiveboardViewController and save it to the meals property
    }
    // Persistence methods
    func saveLiveboards() {
        // Save the LB model data to the disk for caching?
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        tableView.reloadData()
    }
    
}

// View using WebView to actually display embedded Liveboard
class LiveboardComponentViewController: UIViewController, WKNavigationDelegate{
    
    var liveboard: Liveboard
    
    @IBOutlet weak var liveboardTitleLabel: UILabel!
    
    @IBOutlet weak var webView: WKWebView!
    
    
    init?(coder: NSCoder, liveboard: Liveboard) {
        self.liveboard = liveboard
        print(self.liveboard)
        super.init(coder: coder)
        
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    /*
     * ThoughtSpot server requires SSO process to complete before loading content
     * The Trusted Authentication SSO mechanism is ideal for this. It can use the Token that is stored wtihin the app
     * This simple version of a workflow uses a hosted HTML page with the JavaScript to directly call the TS token login API (the trustedLoginUrl)
     * Once the trusted auth page is loaded in the WKWebView, the Token and TSUrl are passed to the page and the JavaScript to do the login process kicks off
     * After trusted login completes within the trusted auth page, session cookies are set within the shared WkWebView processpool and the actual content pages can be loaded
     */
    override func viewDidLoad() {
        super.viewDidLoad()
        // This shares any WKWebViews so that the load quickly and share sessions
        webView.configuration.processPool = wkProcessPool
        // Need to assign the navigationDelegate to get the listener functions of WKNavigationDelegate
        webView.navigationDelegate = self
        
        liveboardTitleLabel.text = self.liveboard.name
        
        // Page with LiveboardEmbed component set to full screen
        // Has a  prepareLiveboardFromApp(json) function for setting variables
        let liveboardLoaderHtmlUrl = "https://tse-auth-token-server-example.vercel.app/ios_liveboard.html"
        
        webView.load(URLRequest(url: URL(string: liveboardLoaderHtmlUrl)!))
        
        /*
        // Simple trusted auth page
        let trustedLoginUrl = "https://tse-auth-token-server-example.vercel.app/trusted_auth.html"
         
         

        // If haven't logged in, first try the trusted_auth page
        if (loggedInTS == false){
            webView.load(URLRequest(url: URL(string: trustedLoginUrl)!))
        }
        
        // if logged in, go to liveboard
        if (loggedInTS == true){
            let liveboardUrl = "\(TSUrl!)/?embedApp=true#/embed/viz/\(self.liveboard.id)"
            webView.load(URLRequest(url: URL(string: liveboardUrl)!))
        }
         */

    }
    
    /*
     * WkNavigationDelegate fires this event after the page has been loaded fully, which is guarantees that the JavaScript can be run
     * The WKWebView.evaluateJavascript() function pushes the encoded Host and Token values across into the web page, which triggers
     * the JS in the page to perform the ThoughtSpot login REST API
     */
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!){
        // make JSON
        print("We loaded the view successfully")
       //  if (loggedInTS == false){
            /*
            struct TrustedAuthJson: Codable {
                var TSHost : String
                var TSToken: String
            }
            let trustedAuthJson = TrustedAuthJson(TSHost: TSUrl!, TSToken: TSAccessToken!)
            print(trustedAuthJson)
            print("Now want to trigger JS")
            */
            struct LiveboardLoadJson: Codable {
                var TSHost : String
                var TSToken: String
                var liveboardId : String
            }
            let liveboardLoadJson = LiveboardLoadJson(TSHost: TSUrl!, TSToken: TSAccessToken!, liveboardId: liveboard.id)
            print(liveboardLoadJson)
            print("Now want to trigger JS")
            
            var jsonString = ""
            let jsonEncoder = JSONEncoder()
           //if let jsonData = try? jsonEncoder.encode(trustedAuthJson),
            if let jsonData = try? jsonEncoder.encode(liveboardLoadJson),
               let jsonStr = String(data: jsonData, encoding: .utf8){
                jsonString = jsonStr
                print(jsonString)
            }
            
            
            // Call the JSON in the WebView, to run the trusted auth API with the passed in token and URL
            webView.evaluateJavaScript("prepareLiveboardFromApp('\(jsonString)')")
            { (any, error) in
                // This fires off as soon as the JavaScript has run in the WebView
                print("Return back from evaluateJavaScript")
                print(any)
                print(error)
                loggedInTS = true
                print("Logged in TS now \(loggedInTS)")
                
                // What condition on the JavaScript side results in an object return?
                if (any != nil){
                    print("Non error: ")
                    print(any!)
                    loggedInTS = true
                    
                }
                // What condiiton on the JavaScript side results in an error return
                if (error != nil){
                    print("Error : \(error!)")
                    loggedInTS = false
                }
                
                /*
                if (loggedInTS == true){
                    // After first login, go to the Liveboard
                    let liveboardUrl = "\(TSUrl!)/?embedApp=true#/embed/viz/\(self.liveboard.id)"
                    self.webView.load(URLRequest(url: URL(string: liveboardUrl)!))
                }*/
                
        //    }
        }

    }
    
    // Prior to segue backing out, can be expanded to do any necessary cleanup (none currently, sample is just display of WebView with TS content)
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        guard let identifier = segue.identifier else { return }

        switch identifier {
            case "unwindFromLiveboardComponent":
                print("back button item tapped")
            default:
                print("unexpected segue identifier")
        }
    }
    
}
