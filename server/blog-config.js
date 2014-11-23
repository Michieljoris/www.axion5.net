//Config for bb-blog
  
//Any of these settings can be overridden by calling the init function on this
//module and passing different values. Any values not defined are taken from
//this set of defaults
module.exports = {
    siteTitle: 'Axion5',
    paths: {
        //Base path to directory with source files for html-builder:
        base: 'build',
        //Path where posts are saved, relative to paths.base:
        posts: 'post',
        //Path to directory served to internet:
        www: 'www',
        //Path where widgets are found, relative to www
        widgets: 'widget'
    }
    //Bb-blog saves data to the server, this limits which paths it is
    //allowed to save to. This is relative to the paths.base path.
    ,writable: ['editable', 'post']
    //Whether to check for session.data.verified === true, set to false for
    //testing purpose
    ,auth: false,
    //Number of teasers/posts per page on collection pages such as landing,
    //archive and tag.
    pagination: 5
    //Recent, archive and tag widget
    //You would set save to true if you want to pull these widgets in ajax calls
    //to build a page dynamically on the client, they get saved to path set in
    //paths above, max refers to number blog titles listed in a widget
    ,widgets: {
        recent: { max: 5, save: false } ,
	archive: { max: 5, save: false } ,
	tag: { max: 5, save: false }
    }
    //If set to true, whether comments are enabled are decided per post,
    //depending on what the setting is in the post's metadata. 
    ,enableCommentsPerPost: true
    //Global comment setting, only effective if previous setting is set to
    //false, set both to false to disable comments alltogether
    ,comments: false
    
    //A recipe (string) or a list of recipes used to build pages unless
    //overridden for a page in the particular pages prop below.
    // ,recipe: { editable: 'recipe.js', nojs: 'recipe.js' }
    // ,recipe: 'default-recipe.js'
    ,recipe: 'axion-recipe.js'
    //If the previous prop is a list the following prop decides which recipe in
    //the list is used. This should be one of the keys of the previous prop.
    ,renderMode: 'editable'
    //Default path into a recipe to where bb-blog is to insert its payload
    //(post, archive/tag/landing teaser list etc), can also be overridden for
    //any particular page by adding this setting to it, eg to pages.post.from
    ,from: [ 'fromTemplate', 'mapping', 'main']
    //Default object path into a recipe to where bb-blog is to insert the out
    //path for a particular page, for instance pages.post.path gets inserted
    //here when building a post page. Can be set per page as well.
    ,to: [ 'toTemplate', 'out' ]
    //For keeping track of when first published. Can be overridden by adding
    //publishedat metadata to a post, no need to modify. TODO Maybe should be
    //removed from here..
    ,publishedat: 'publishedat.json'
    
    //Bb-blog can build collections of posts, organised by tag, year/month,
    //unpublished status and just all of them in reverse chronological order
    //(landing). Other than that it can build a page for every post as well. Set
    //any of the following to false to prevent the page(s) from being build. Or
    //assign an object specifying path to save the pages to (relative to
    //base.www) and/or a recipe to use to build the page. A full example set of
    //props is given for the archive page. All pages can also just be set to
    //true or false, or a string for a path.
    ,pages: {
        // Landing page with all teasers of posts (paginated).
        landing: true,
        // Archive pages. Teasers of posts listed by years and months. 
        archive: { path: 'archive'
                   // ,recipe: 'some archive recipe'  //or:
                   // ,recipe: { editable: 'recipe.js', nojs: 'recipe.js' }
                   // ,from: [ 'fromTemplate', 'mapping', 'main']
                   // ,to: [ 'toTemplate', 'out' ]
                 },
        // List of teasers of posts, listed by tag. 
        tag: { path: 'tag' },
        // A page with a post
	post: { path: 'post'
		// ,recipe: { editable: 'editable-post-recipe.js', nojs: 'default-recipe.js' }
	      },
	//Any unpublished posts will be added to the unpublished folder, not to
        //the post folder. Only prop that can be set is the path.
	unpublished: { path: 'unpublished' }
    }
    //NOT TESTED
    //Json of list of posts on server. Also set whether to add precalculated
    //lists. Set to false to disable producing this json. Can be used by client
    //to dynamically build a blog.
    ,json: { byTag: true, byYearMonth: true, byReverseDate: true }
};

//A more minimal config, with just deltas from defaults listed:
// module.exports = {
//     paths: { base: 'build' },
//     writable: ['editable', 'post'],
//     pagination: 5,
//     auth: false
//     ,widgets: {
//         recent: { max: 5} ,archive: { max: 5 } ,tag: { max: 5 }
//     }
//     ,pages: {
//         archive: true,
//         tag: true,
//         unpublished: true,
//         landing: true
//         ,post: {
//             recipe: { editable: 'editable-post-recipe.js', nojs: 'default-recipe.js' }
//         }
//     }
//     ,recipe: 'default-recipe.js'
// };
