
A. Pre-requisite:
    git config --global user.name "Rahul Vishwakarma"
    git config --global user.email "rahul@awnics.com"


1. Fork the repository on github.com (https://github.com/AWNICS/mesomeds-ng2)

2. Now clone your repository. This will be added as origin 
     git clone https://github.com/rawnics/mesomeds-ng2

3. Get into the directory and make changes to the code and save it


4. Stage the changes using add and check the status
    git add .
    git status 

5. Commit the changes to the local repository 
    git commit -m "Updated the code with some text information" --author="Rahul Vishwakarma <rahul@awnics.com>"
    

6. Add the upstream repository (Original repository) for pull or updating your code
    git remote add upstream https://github.com/AWNICS/mesomeds-ng2
    git remote
    git pull upstream master

    Note: Pull does a fetch and merge automatically, otherwise we will need to fetch (git fetch upstream) 
          and merge separately as (git merge upstream/master). 

7. Push the committed changes to your fork 
    git push origin master 

8. Now in your github's fork repository you should be able to see that your branch is a commit ahead of the original upstream repository.
   Here, you should create a pull request using the button on the web page.

9. The pull request will be submitted and the owner of the repository will merge the pull request after comparing the changes.