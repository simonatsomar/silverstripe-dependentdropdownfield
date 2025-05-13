jQuery.entwine("dependentdropdown", function ($) {

	$(":input.dependent-dropdown").entwine({
		onmatch: function () {
			var drop = this;
			var depends = null;
			var dependsForm = drop.data('depends-form');

			if (dependsForm) {
				depends = drop.closest('form');
			} else {
				depends = ($(":input[name=" + drop.data('depends').replace(/[#;&,.+*~':"!^$[\]()=>|\/]/g, "\\$&") + "]"));

				if (!depends.val()) {
					drop.disable(drop.data('unselected'));
				}
			}

			this.parents('.field:first').addClass('dropdown');

			depends.change(function () {
				if (dependsForm) {
					updateOptions(
						this.serialize()
					);
				} else if (!this.value) {
					drop.disable(drop.data('unselected'));
				} else {
					drop.disable("Loading...");

					updateOptions({
						val: this.value
					});
				}				
			});
		},
		updateOptions: function(formData) {
			$.get(
				drop.data('link'),
				formData,
				function (data) {
					drop.enable();

					if (drop.data('empty') || drop.data('empty') === "") {
						drop.append($("<option />").val("").text(drop.data('empty')));
					}

					$.each(data, function () {
						drop.append($("<option />").val(this.k).text(this.v));
					});
					drop.trigger("liszt:updated").trigger("chosen:updated").trigger("change");
				}
			);
		},
		disable: function (text) {
			this.empty().append($("<option />").val("").text(text)).attr("disabled", "disabled").trigger("liszt:updated").trigger("chosen:updated");
		},
		enable: function () {
			this.empty().removeAttr("disabled").next().removeClass('chzn-disabled');
		}
	});

});
