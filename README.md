###validate form when you trigger blur of the input Or you need to post you form to server
#How To Use
####Step1:Load the validate.js and bootstrap.js to you page(We use tooltip.js in bootstrap.js to show errTip<a>http://v3.bootcss.com/javascript/#tooltips</a>)
####Step2:init validate:$form.validate() to init the validation of the form. U can get a obj here.
####Step3:add class 'va' to your input which you need to validate in the form you init.Then, maybe, you wanna validate the input Required, you can append class 'required'. Class provided list here:
          required: validate required
          num: validate number,
          posNum: validate positive number,
          notNegNum: validate not negative number
          numRange(num1,num2)
          numRange(num1,num2]
          numRange[num1,num2)
          numRange[num1,num2]: validate the value range the num1 and num2. [ or ] says contains the limit, and ( or ) not
####Step4:when you save the form info to server, if validation is necessary. Please use the returned obj in Step2 like this:obj.saveVer(). If you get a false, the validation did not pass.
